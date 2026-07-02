# Security Policy

## Supported Versions

We provide security updates for the latest major version of CasYuk. Please ensure you are running the most recent version before reporting a security vulnerability.

| Version | Supported          |
| ------- | ------------------ |
| 0.x.x   | :white_check_mark: |

## Reporting a Vulnerability

We take all security vulnerabilities seriously, especially concerning the `battery.rs` logic which may interact with system/hardware states like `sysfs`, `WMI`, or macOS `ioreg`/`bclm`.

If you discover a security vulnerability within CasYuk, please **DO NOT** open a public issue.

Instead, please send an email directly to **teddir.ads@gmail.com**. 

### What to include in your report
- A description of the vulnerability and its impact.
- Steps to reproduce the issue.
- Your OS and CasYuk version.
- Any potential fix or suggestion if you have one.

### Our Response
We will acknowledge receipt of your vulnerability report within 48 hours and strive to send you regular updates about our progress. If the vulnerability is accepted, we will issue a patch in the next release and credit you (if desired) in the release notes.
