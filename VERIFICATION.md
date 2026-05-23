# Verification Matrix

This is the single source of truth for which OS × DB combinations have been verified, derived, or flagged. The in-site `/verification` page is generated from `src/data/os-registry.ts`, which is the authoritative file. This document is a hand-readable mirror of that registry plus the rationale per cell.

## Legend

| Symbol | Status      | Meaning                                                                     |
|--------|-------------|-----------------------------------------------------------------------------|
| ✓      | Verified    | Commands taken from v5.0.0 source guides or trivially translated            |
| ◊      | Derived     | Built from vendor docs + source pattern; needs review before production     |
| ◐      | Partial     | Works in practice, but the OS/vendor combination is not officially listed   |
| ⚠      | Unverified  | Cannot verify in current state (e.g. Microsoft repo missing for that OS)    |
| ✕      | Unsupported | The vendor explicitly does not support this OS × DB combination             |

## Full matrix

| OS                       | Tier | PostgreSQL 16 | MySQL 8.4 LTS  | MSSQL 2022 | Oracle 19c     | Built |
|--------------------------|------|---------------|----------------|------------|----------------|-------|
| RHEL 9                   | 1    | ✓             | ◊              | ◊          | ✓              | ✓     |
| RHEL 8                   | 1    | ✓             | ◊              | ◊          | ✓              | ✓     |
| Oracle Linux 9           | 1    | ✓             | ◊              | ◊          | ✓              | ✓     |
| **Oracle Linux 8**       | 1    | ✓ (src)       | ◊              | ◐          | **✓ (src)**    | ✓     |
| SLES 15                  | 1    | ✓             | ◊              | ◊          | ✓              | ✓     |
| Ubuntu 24.04             | 1    | ✓             | ◊              | ⚠          | ◐ IC only      | ✓     |
| **Ubuntu 22.04**         | 1    | ✓             | ◊              | ◊          | ◐ IC only      | ✓     |
| Ubuntu 20.04             | 1    | ✓             | ◊              | ◊          | ◐ IC only      | ✓     |
| Debian 12                | 1    | ✓             | ◊              | ✕          | ◐ IC only      | ✓     |
| Debian 11                | 1    | ✓             | ◊              | ✕          | ◐ IC only      | ✓     |
| Rocky Linux 9            | 1    | ✓             | ◊              | ◐          | ✓              | ✓     |
| Rocky Linux 8            | 1    | ✓             | ◊              | ◐          | ✓              | ✓     |
| AlmaLinux 9              | 1    | ✓             | ◊              | ◐          | ✓              | ✓     |
| AlmaLinux 8              | 1    | ✓             | ◊              | ◐          | ✓              | ✓     |
| CentOS Stream 9          | 1    | ✓             | ◊              | ◐          | ◐              | ✓     |
| Amazon Linux 2023        | 1    | ✓             | ◊              | ◐          | ◐              | ✓     |
| Amazon Linux 2           | 1    | ✓             | ◊              | ◐          | ◐              | ✓     |
| Alpine Linux 3.21        | 2    | ✓             | ◊              | ✕          | ✕              | ✓     |
| Alpine Linux 3.20        | 2    | ✓             | ◊              | ✕          | ✕              | ✓     |
| Alpine Linux 3.19        | 2    | ✓             | ◊              | ✕          | ✕              | ✓     |
| Alpine Linux 3.18        | 2    | ✓             | ◊              | ✕          | ✕              | ✓     |

Rows marked **bold** are the source-doc combinations (PostgreSQL on the generic Linux flow, Oracle 19c on Oracle Linux 8).

## Per-cell rationale

### PostgreSQL

- **All Tier 1 RHEL family (RHEL, Oracle Linux, Rocky, Alma, CentOS Stream, Amazon Linux):** `✓` PGDG-EL-8 or PGDG-EL-9 RPM, `dnf module disable postgresql`, `postgresql16-server`. Matches the v5.0.0 generic guide.
- **Ubuntu and Debian:** `✓` PGDG apt repo, `apt install postgresql-16`. Standard PGDG-published path.
- **SLES 15:** `✓` `zypper` flow against the same PGDG repos. Documented by PostgreSQL.
- **Alpine:** `✓` `apk add postgresql16 postgresql16-contrib`. musl libc compatibility for Postgres is mature.

### MySQL

- **All Tier 1 and Tier 2:** `◊` All MySQL flows are derived. Source docs cover PostgreSQL and Oracle only. Commands here use the published MySQL APT/RPM community repos plus the JDBC-in-`/opt/miniorange/drivers/` convention from the Oracle source flow. The MySQL JDBC driver placement should be confirmed with miniOrange support before production rollout.

### MSSQL

- **RHEL 8, 9, SLES 15, Ubuntu 20.04, 22.04:** `◊` Officially supported by Microsoft. Derived in this site because the IDP wiring (JDBC driver placement) is not in the v5.0.0 source docs.
- **Ubuntu 24.04:** `⚠` As of v5.0.0 release, Microsoft has not published a `packages.microsoft.com/config/ubuntu/24.04/` repo. Page is in scope but installation may fail until Microsoft ships the repo.
- **Oracle Linux 8 and 9:** `◐` Microsoft does not list OL in its supported matrix, but OL is binary-compatible with RHEL. The RHEL 8 repo installs and runs cleanly on OL 8 in practice. Not officially supported.
- **Rocky 8, 9 and AlmaLinux 8, 9:** `◐` Same as OL: rebuilds of RHEL, Microsoft does not list them, the RHEL repo works in practice.
- **CentOS Stream 9:** `◐` Stream is the rolling preview of RHEL. Microsoft does not list it. Works with the RHEL 9 repo.
- **Amazon Linux 2 and 2023:** `◐` Not on Microsoft's supported list. The RHEL repo can be coaxed to work; not recommended for production.
- **Debian 11 and 12:** `✕` Microsoft does not publish a Debian repo for MSSQL. Officially unsupported. The DB tile is disabled in the UI.
- **Alpine 3.18 to 3.21:** `✕` MSSQL requires `glibc`. Alpine is `musl`. Microsoft has never supported MSSQL on musl libc.

### Oracle DB 19c

- **RHEL 8, 9, Oracle Linux 8, 9, Rocky 8, 9, AlmaLinux 8, 9:** `✓` Officially supported by Oracle (with caveats for rebuilds). Same install flow as Oracle Linux 8: preinstall RPM, `oracle-database-ee-19c`, PDB, listener, JDBC driver placement.
- **SLES 15:** `✓` Officially supported by Oracle.
- **CentOS Stream 9 and Amazon Linux 2/2023:** `◐` Not on Oracle's supported matrix but is binary-compatible enough to work in practice.
- **Debian 11, 12 and Ubuntu 20.04, 22.04, 24.04:** `◐` Oracle does not ship 19c for Debian-family OSes. Run Oracle on a separate RHEL/OL host and install only the Instant Client + JDBC driver here. Not officially supported as a single-host deployment.
- **Alpine 3.18 to 3.21:** `✕` Oracle DB requires `glibc`. Alpine is `musl`. Oracle has never supported its DB on musl libc.

### Tier 2 (Alpine)

All Alpine versions are marked Tier 2 due to:

- OpenRC instead of systemd (different service file syntax; the source `mo-installer` flow assumes systemd)
- musl libc instead of glibc (no MSSQL, no Oracle; verify JNI bits)
- BusyBox utilities by default (some scripts assume GNU `sed`, `grep`)

Postgres and MySQL work, but the `mo-installer` itself may need adaptation. None of the Alpine pages are built in the current vertical slice.

## Source of truth

- `src/data/os-registry.ts` — every status here is reflected in the in-site UI and the homepage cards.
- This document is updated alongside the registry. If they disagree, the registry wins.
- Verification status moves only when a row is built and tested on real hardware or a real VM.

## Open follow-ups

- Confirm MySQL and MSSQL JDBC driver placement convention (`/opt/miniorange/drivers/`) with miniOrange engineering. If the installer scans an alternate path for non-Oracle JDBC drivers, the derived sections need a one-line correction across all OSes.
- Confirm whether the v5.0.0 installer detects Debian/Ubuntu differently from RHEL family for purposes of Java/Redis bundling. The `mo-installer.sh` script is OS-aware; the per-OS pages assume the installer handles the difference internally.
- Build Ubuntu 24.04 once Microsoft publishes the 24.04 MSSQL repo, and downgrade the MSSQL status from `⚠` to `◊`.
