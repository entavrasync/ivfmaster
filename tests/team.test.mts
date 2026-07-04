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

  assert.equal(careTeam.length, 4)
  assert.equal(facilityPhotos.length, 4)

  for (const item of [...doctors, ...careTeam, ...facilityPhotos]) {
    assert(item.image.src.startsWith('/'), 'Team image slots must use public absolute paths')
    assert(item.image.altKey.length > 0, 'Every team image slot needs a translated alt key')
  }
})

test('all locales expose the same complete team-page message contract', () => {
  const localeFiles = ['en', 'hi', 'mr'] as const
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
    assert.equal(Object.keys(teamMessages.careTeam).length, 4)
    assert.equal(Object.keys(teamMessages.facilityPhotos).length, 4)
  }
})

