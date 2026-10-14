# Zenith beta status

## Latest release: 1.2.02 — October 13, 2026

- Bulk image-to-PDF conversion without truncating large incoming batches to 50 files.
- Page-by-page PDF writing, preserved selection order and a lighter file drawer.
- Converted source entries leave the shelf after success; originals remain on disk. Outputs open in Downloads / Zenith Conversions.
- Pinned Game Mode stats with separate CPU and GPU graphs, memory, temperature and power information.
- Experimental gaming tools require setup and supported integrations; they are not universal game compatibility guarantees.

[Download the signed update](https://github.com/techgamewithharsh-dot/zenith-dynamic-notch/releases/latest) · [Release notes](https://github.com/techgamewithharsh-dot/zenith-dynamic-notch/releases/tag/v1.2.02)

Automatic delivery requires a running, online Zenith with a writable installation. Legacy disabled checks and macOS restrictions can require manual installation.


**Created by Harsh Paun. Currently in beta.**

## Download

[Download Zenith Beta — October 11, 2026](https://github.com/techgamewithharsh-dot/zenith-dynamic-notch/releases/latest) from GitHub Releases. Open Zenith.dmg and move Zenith to Applications. The package is approximately 309 MB; the release notes include its SHA-256 checksum.

## Requirements

The current build targets macOS 26 or later on Apple silicon. Floating presentations do not require a physical notch. Lid sensing, fan controls and some metrics are hardware dependent. Intel support is not currently advertised.

## Integration limits

- Notifications, inline replies and call controls are experimental. They require permissions and usable controls in the source app; native banners may still appear. Universal support is not promised.
- Thunderstorm launches saved links to commands installed in Raycast. Raycast is required.
- Audio controls depend on the active app and its available controls.
- Coding-agent activity and quota information may be incomplete or require manual setup.
- Travel, sports and delivery layouts require compatible supplied updates.
- DropClip’s general-purpose AI writing and translation actions are not release-ready.
- Some lock-screen widget designs contain preview data rather than live information.
- Optical face recognition is experimental camera-based recognition, not Apple Face ID or equivalent security.
- Fan and charge management require compatible hardware and the appropriate helper.

## Permissions

Grant only access required by features you choose. Depending on those choices, Zenith may request Accessibility / Device Control and Data Access, Camera, Calendar, audio, Automation, or display-capture access. Review the macOS prompts and use Zenith’s permission dashboard.

## Feedback

Report the app version, macOS version, Mac model, expected behavior and actual behavior in a GitHub issue. Remove personal information from attachments.

[Full feature directory](FEATURES.md) · [Overview](README.md)
