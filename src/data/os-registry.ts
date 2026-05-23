// OS registry: single source of truth for the homepage cards and the verification matrix.
// `built: true` means a full per-OS content directory exists under src/content/os/<slug>/.
// `built: true` entries render on the homepage as in-scope but not yet authored
// (vertical slice ships RHEL 9, Oracle Linux 8, Ubuntu 22.04).

export type DBStatus = 'verified' | 'derived' | 'partial' | 'unverified' | 'unsupported';

export interface DBSupport {
  postgres: { status: DBStatus; version: string; note?: string };
  mysql:    { status: DBStatus; version: string; note?: string };
  mssql:    { status: DBStatus; version: string; note?: string };
  oracle:   { status: DBStatus; version: string; note?: string };
}

export interface OSEntry {
  slug: string;
  name: string;
  version: string;
  category: 'enterprise' | 'rebuild' | 'community' | 'cloud' | 'container';
  packageManager: 'apt' | 'dnf' | 'yum' | 'zypper' | 'apk';
  initSystem: 'systemd' | 'openrc';
  tier: 1 | 2;
  built: boolean;
  releaseYear: number;
  recommended?: boolean;
  dbs: DBSupport;
  quirks?: string[];
}

const dnfRhelFamily = (note?: string): DBSupport => ({
  postgres: { status: 'verified', version: '16' },
  mysql:    { status: 'derived',  version: '8.4 LTS' },
  mssql:    { status: 'derived',  version: '2022', note },
  oracle:   { status: 'verified', version: '19c' },
});

export const OSES: OSEntry[] = [
  // ---- Enterprise (Tier 1) ----
  {
    slug: 'rhel-9', name: 'Red Hat Enterprise Linux', version: '9',
    category: 'enterprise', packageManager: 'dnf', initSystem: 'systemd',
    tier: 1, built: true, releaseYear: 2022, recommended: true,
    dbs: dnfRhelFamily(),
  },
  {
    slug: 'rhel-8', name: 'Red Hat Enterprise Linux', version: '8',
    category: 'enterprise', packageManager: 'dnf', initSystem: 'systemd',
    tier: 1, built: true, releaseYear: 2019,
    dbs: dnfRhelFamily(),
  },
  {
    slug: 'oracle-linux-9', name: 'Oracle Linux', version: '9',
    category: 'enterprise', packageManager: 'dnf', initSystem: 'systemd',
    tier: 1, built: true, releaseYear: 2022,
    dbs: dnfRhelFamily(),
  },
  {
    slug: 'oracle-linux-8', name: 'Oracle Linux', version: '8',
    category: 'enterprise', packageManager: 'dnf', initSystem: 'systemd',
    tier: 1, built: true, releaseYear: 2019, recommended: true,
    dbs: dnfRhelFamily(),
  },
  {
    slug: 'sles-15', name: 'SUSE Linux Enterprise Server', version: '15',
    category: 'enterprise', packageManager: 'zypper', initSystem: 'systemd',
    tier: 1, built: true, releaseYear: 2018,
    dbs: {
      postgres: { status: 'verified', version: '16' },
      mysql:    { status: 'derived',  version: '8.4 LTS' },
      mssql:    { status: 'derived',  version: '2022' },
      oracle:   { status: 'verified', version: '19c' },
    },
  },
  // ---- Enterprise Ubuntu (Tier 1) ----
  {
    slug: 'ubuntu-24.04', name: 'Ubuntu Server', version: '24.04 LTS',
    category: 'enterprise', packageManager: 'apt', initSystem: 'systemd',
    tier: 1, built: true, releaseYear: 2024,
    dbs: {
      postgres: { status: 'verified', version: '16' },
      mysql:    { status: 'derived',  version: '8.4 LTS' },
      mssql:    { status: 'unverified', version: '2022', note: 'No Microsoft repo published for 24.04 yet' },
      oracle:   { status: 'partial', version: '19c IC', note: 'Instant Client only on Debian/Ubuntu' },
    },
  },
  {
    slug: 'ubuntu-22.04', name: 'Ubuntu Server', version: '22.04 LTS',
    category: 'enterprise', packageManager: 'apt', initSystem: 'systemd',
    tier: 1, built: true, releaseYear: 2022, recommended: true,
    dbs: {
      postgres: { status: 'verified', version: '16' },
      mysql:    { status: 'derived',  version: '8.4 LTS' },
      mssql:    { status: 'derived',  version: '2022' },
      oracle:   { status: 'partial', version: '19c IC', note: 'Instant Client only on Debian/Ubuntu' },
    },
  },
  {
    slug: 'ubuntu-20.04', name: 'Ubuntu Server', version: '20.04 LTS',
    category: 'enterprise', packageManager: 'apt', initSystem: 'systemd',
    tier: 1, built: true, releaseYear: 2020,
    dbs: {
      postgres: { status: 'verified', version: '16' },
      mysql:    { status: 'derived',  version: '8.4 LTS' },
      mssql:    { status: 'derived',  version: '2022' },
      oracle:   { status: 'partial', version: '19c IC', note: 'Instant Client only on Debian/Ubuntu' },
    },
  },
  {
    slug: 'debian-12', name: 'Debian', version: '12',
    category: 'enterprise', packageManager: 'apt', initSystem: 'systemd',
    tier: 1, built: true, releaseYear: 2023,
    dbs: {
      postgres: { status: 'verified', version: '16' },
      mysql:    { status: 'derived',  version: '8.4 LTS' },
      mssql:    { status: 'unsupported', version: '2022', note: 'Microsoft does not publish a Debian repo' },
      oracle:   { status: 'partial', version: '19c IC', note: 'Instant Client only on Debian' },
    },
  },
  {
    slug: 'debian-11', name: 'Debian', version: '11',
    category: 'enterprise', packageManager: 'apt', initSystem: 'systemd',
    tier: 1, built: true, releaseYear: 2021,
    dbs: {
      postgres: { status: 'verified', version: '16' },
      mysql:    { status: 'derived',  version: '8.4 LTS' },
      mssql:    { status: 'unsupported', version: '2022', note: 'Microsoft does not publish a Debian repo' },
      oracle:   { status: 'partial', version: '19c IC', note: 'Instant Client only on Debian' },
    },
  },
  // ---- Rebuilds (Tier 1) ----
  {
    slug: 'rocky-9', name: 'Rocky Linux', version: '9',
    category: 'rebuild', packageManager: 'dnf', initSystem: 'systemd',
    tier: 1, built: true, releaseYear: 2022,
    dbs: {
      ...dnfRhelFamily('Unofficial on RHEL rebuilds; the RHEL 9 packages work in practice'),
      mssql: { status: 'partial', version: '2022', note: 'Microsoft does not officially list rebuilds; use RHEL 9 repo at your own risk' },
    },
  },
  {
    slug: 'rocky-8', name: 'Rocky Linux', version: '8',
    category: 'rebuild', packageManager: 'dnf', initSystem: 'systemd',
    tier: 1, built: true, releaseYear: 2021,
    dbs: {
      ...dnfRhelFamily(),
      mssql: { status: 'partial', version: '2022', note: 'Use RHEL 8 repo; not officially listed by Microsoft' },
    },
  },
  {
    slug: 'alma-9', name: 'AlmaLinux', version: '9',
    category: 'rebuild', packageManager: 'dnf', initSystem: 'systemd',
    tier: 1, built: true, releaseYear: 2022,
    dbs: {
      ...dnfRhelFamily(),
      mssql: { status: 'partial', version: '2022', note: 'Use RHEL 9 repo; not officially listed by Microsoft' },
    },
  },
  {
    slug: 'alma-8', name: 'AlmaLinux', version: '8',
    category: 'rebuild', packageManager: 'dnf', initSystem: 'systemd',
    tier: 1, built: true, releaseYear: 2021,
    dbs: {
      ...dnfRhelFamily(),
      mssql: { status: 'partial', version: '2022', note: 'Use RHEL 8 repo; not officially listed by Microsoft' },
    },
  },
  {
    slug: 'centos-stream-9', name: 'CentOS Stream', version: '9',
    category: 'rebuild', packageManager: 'dnf', initSystem: 'systemd',
    tier: 1, built: true, releaseYear: 2021,
    dbs: {
      postgres: { status: 'verified', version: '16' },
      mysql:    { status: 'derived',  version: '8.4 LTS' },
      mssql:    { status: 'partial',  version: '2022', note: 'CentOS Stream is a rolling preview of RHEL; not officially listed by Microsoft' },
      oracle:   { status: 'partial',  version: '19c',  note: 'Officially supported on RHEL/OL only; works in practice on Stream' },
    },
  },
  // ---- Cloud (Tier 1) ----
  {
    slug: 'amazon-linux-2023', name: 'Amazon Linux', version: '2023',
    category: 'cloud', packageManager: 'dnf', initSystem: 'systemd',
    tier: 1, built: true, releaseYear: 2023,
    dbs: {
      postgres: { status: 'verified', version: '16' },
      mysql:    { status: 'derived',  version: '8.4 LTS' },
      mssql:    { status: 'partial',  version: '2022', note: 'Not officially supported by Microsoft on AL2023' },
      oracle:   { status: 'partial',  version: '19c',  note: 'Not officially supported by Oracle on Amazon Linux' },
    },
  },
  {
    slug: 'amazon-linux-2', name: 'Amazon Linux', version: '2',
    category: 'cloud', packageManager: 'yum', initSystem: 'systemd',
    tier: 1, built: true, releaseYear: 2018,
    dbs: {
      postgres: { status: 'verified', version: '16' },
      mysql:    { status: 'derived',  version: '8.4 LTS' },
      mssql:    { status: 'partial',  version: '2022', note: 'Not officially supported by Microsoft on AL2' },
      oracle:   { status: 'partial',  version: '19c',  note: 'Not officially supported by Oracle on Amazon Linux' },
    },
  },
  // ---- Container (Tier 2) ----
  {
    slug: 'alpine-3.21', name: 'Alpine Linux', version: '3.21',
    category: 'container', packageManager: 'apk', initSystem: 'openrc',
    tier: 2, built: true, releaseYear: 2024,
    dbs: {
      postgres: { status: 'verified',    version: '16', note: 'musl libc; verify JNI bits in installer' },
      mysql:    { status: 'derived',     version: '8.4 LTS' },
      mssql:    { status: 'unsupported', version: '2022', note: 'Microsoft does not support MSSQL on musl libc' },
      oracle:   { status: 'unsupported', version: 'n/a', note: 'Oracle DB requires glibc; not supported on Alpine' },
    },
    quirks: ['OpenRC, not systemd', 'musl libc instead of glibc', 'BusyBox utilities by default'],
  },
  {
    slug: 'alpine-3.20', name: 'Alpine Linux', version: '3.20',
    category: 'container', packageManager: 'apk', initSystem: 'openrc',
    tier: 2, built: true, releaseYear: 2024,
    dbs: {
      postgres: { status: 'verified',    version: '16' },
      mysql:    { status: 'derived',     version: '8.4 LTS' },
      mssql:    { status: 'unsupported', version: '2022', note: 'Microsoft does not support MSSQL on musl libc' },
      oracle:   { status: 'unsupported', version: 'n/a', note: 'Oracle DB requires glibc; not supported on Alpine' },
    },
    quirks: ['OpenRC, not systemd', 'musl libc'],
  },
  {
    slug: 'alpine-3.19', name: 'Alpine Linux', version: '3.19',
    category: 'container', packageManager: 'apk', initSystem: 'openrc',
    tier: 2, built: true, releaseYear: 2023,
    dbs: {
      postgres: { status: 'verified',    version: '16' },
      mysql:    { status: 'derived',     version: '8.4 LTS' },
      mssql:    { status: 'unsupported', version: '2022', note: 'Microsoft does not support MSSQL on musl libc' },
      oracle:   { status: 'unsupported', version: 'n/a', note: 'Oracle DB requires glibc; not supported on Alpine' },
    },
    quirks: ['OpenRC, not systemd', 'musl libc'],
  },
  {
    slug: 'alpine-3.18', name: 'Alpine Linux', version: '3.18',
    category: 'container', packageManager: 'apk', initSystem: 'openrc',
    tier: 2, built: true, releaseYear: 2023,
    dbs: {
      postgres: { status: 'verified',    version: '16' },
      mysql:    { status: 'derived',     version: '8.4 LTS' },
      mssql:    { status: 'unsupported', version: '2022', note: 'Microsoft does not support MSSQL on musl libc' },
      oracle:   { status: 'unsupported', version: 'n/a', note: 'Oracle DB requires glibc; not supported on Alpine' },
    },
    quirks: ['OpenRC, not systemd', 'musl libc'],
  },
];

export const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'enterprise', label: 'Enterprise' },
  { id: 'rebuild', label: 'RHEL Rebuilds' },
  { id: 'cloud', label: 'Cloud' },
  { id: 'container', label: 'Container' },
];

export function osBySlug(slug: string): OSEntry | undefined {
  return OSES.find((o) => o.slug === slug);
}
