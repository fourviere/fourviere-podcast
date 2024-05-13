# Fourviere Podcast

https://www.fourviere.io

The RSS feed editor designed for podcasters who dare to break free
from the confines of centralized platforms, a beacon of independence
in the digital age, offering you the flexibility to upload your
podcast assets via FTP, S3, or even manual download, ensuring your
content is exactly where you want it, when you want it.

![Fourviere](./docs/01.png)

## What is fourviere.io?

Fourviere.io is a desktop application available for Mac, Windows, and Linux systems. It assists you in managing your RSS feed and is ideal for those who wish to host their feed and asset files (audio, images) independently, without relying on platforms or CMSs that require installation on a server and some technical skills.

To get started, all you need is a shared hosting service that offers an FTP connection or an S3-compatible service, install the fourviere app in your computer, and configure your feed settings. We will soon provide guides to help you set this up. Additionally, for those who prefer to manage the process themselves, Fourviere.io offers the option to export the feed file.

Now it's time to take control of your podcast feed and create a new episode of your show!

## Why we created it?

We all see that the world of podcasting is increasingly becoming a walled garden dominated by big players, so returning to its roots, the RSS feed, is both a political act and a matter of survival. To achieve this, we need to create software that meets all the requirements of modern software in terms of functionality, aesthetics, and ease of use, while under the hood, it has a heart made of XML.

## Why and when should you use it?

1. When you don't want to depend on third-party platforms whose aim is to centralize and monetize your content (sometimes without your knowledge and without sharing the profits).

2. When you already have a web space and want to host a podcast without necessarily having to install CMSs that require databases, configurations, and computational power. After all, podcasting is about XML and assets; do we really need a CMS?

3. When you want to scale the distribution of your episodes and independently manage the entire process using services like AWS, Cloudflare, etc.

## Bootstrap the project

[![test-on-pr](https://github.com/fourviere/fourviere-podcast/actions/workflows/test-on-pr.yml/badge.svg)](https://github.com/fourviere/fourviere-podcast/actions/workflows/test-on-pr.yml)

- Install [Node.js](https://nodejs.org/en) and [Rust](https://www.rust-lang.org/)
- Install [Intel oneMKL](https://www.intel.com/content/www/us/en/developer/tools/oneapi/onemkl-download.html) (Optional Linux and Windows)
- Install [CUDA Toolkit](https://developer.nvidia.com/cuda-downloads) and [cuDNN](https://developer.nvidia.com/cudnn-downloads) (Optional Linux and Windows) 
- Clone the repository
- Optionally enable the desired [feature flag](#accelerated-ai-features) 
- Run `npm install` from the project's root folder
- Run `npm run dev` from the projects root folder

## Accelerated AI features
The project come packed with `metal` `mkl` `cuda` features flag that enables optimization for AI tasks.

The following table summurizes the feature-builds matrix:

| environment     | metal | mkl | cuda | nightly_builds                         | stable_builds         |
|-----------------|-------|-----|------|----------------------------------------|-----------------------|
| darwin_x86_64   | Y     | N   | N    | metal --> app, dmg                     | metal --> app, dmg    |
| darwin_aaarch64 | Y     | N   | N    | metal --> app, dmg                     | metal --> app, dmg    |
| linux_x86_64    | N     | Y   | Y    | mkl  --> deb, AppImage<br>cuda --> deb | mkl --> deb, AppImage |
| windows_x86_64  | N     | Y   | Y    | mkl --> msi, exe<br>cuda --> msi, exe  | mkl --> msi, exe      |
 
### FAQ

- Where can I find the link for the linux CUDA version?
  - Unfortunately the pkg2appimage/excludelist does not exclude `libcuda1.so` when grabbing libs dependencies. The library is provided by proprietary Nvidia drivers
