import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import test from 'node:test'

const TEAM_DATA_PATH = new URL('../lib/team.ts', import.meta.url)

test('team data defines the two real doctors and editable supporting-team slots', async () => {
  assert.equal(existsSync(TEAM_DATA_PATH), true, 'Expected lib/team.ts to exist')

  const { careTeam, doctors, facilityPhotos } = await import('../lib/team.ts')

  assert.deepEqual(
    doctors.map((doctor) => doctor.slug),
    ['gorakh-mandrupkar', 'saie-mandrupkar']
  )
  assert.equal(doctors[0]?.name, 'Dr. Gorakh Mandrupkar')
  assert.equal(doctors[1]?.name, 'Dr. Saie Mandrupkar')
  assert(doctors[0]?.credentials.some((credential) => credential.includes('National Health Mission')))
  assert(doctors[0]?.credentials.some((credential) => credential.includes('FOGSI')))
  assert(doctors[1]?.credentials.some((credential) => credential.includes('2,000+ couples')))

  assert.equal(careTeam.length, 2)
  assert(careTeam.some((member) => member.credentials?.some((c) => c.includes('CHARUSAT'))))
  assert.equal(facilityPhotos.length, 4)

  for (const item of [...doctors, ...careTeam]) {
    assert(item.image.src.startsWith('/'), 'Team image slots must use public absolute paths')
    assert(item.image.altKey.length > 0, 'Every team image slot needs a translated alt key')
  }

  // Facility areas hold one or more real clinic photos. A single image renders a
  // plain tile; two or more turn that tile into the in-place carousel.
  for (const facility of facilityPhotos) {
    assert(facility.images.length >= 1, `Facility area ${facility.id} needs at least one photo`)
    for (const image of facility.images) {
      assert(image.src.startsWith('/'), 'Facility photos must resolve to a served asset path')
    }
  }

  const lab = facilityPhotos.find((photo) => photo.messageKey === 'laboratory')
  assert(lab !== undefined, 'Expected a laboratory facility area')
  assert(lab.images.length >= 2, 'The laboratory tile drives the carousel and needs multiple photos')
})

test('all locales expose the same complete team-page message contract', () => {
  const localeFiles = ['en', 'mr'] as const
  const messages = localeFiles.map((locale) =>
    JSON.parse(
      readFileSync(new URL(`../messages/${locale}.json`, import.meta.url), 'utf8')
    ).Team
  )
  const requiredKeys = [
    'eyebrow',
    'headline',
    'lead',
    'doctorsHeading',
    'coupleNote',
    'careTeamHeading',
    'facilityHeading',
    'closingHeadline',
    'closingCta',
    'closingNote',
  ]

  for (const teamMessages of messages) {
    for (const key of requiredKeys) {
      assert.equal(typeof teamMessages[key], 'string', `Missing Team.${key}`)
    }
    assert.equal(Object.keys(teamMessages.doctors).length, 2)
    assert.equal(Object.keys(teamMessages.careTeam).length, 2)
    assert.equal(Object.keys(teamMessages.facilityPhotos).length, 4)
  }
})

