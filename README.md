# Fourviere Podcast

Fourviere aims to be the most advanced RSS feed editor for open podcasting out there.

![Fourviere](./docs/fourviere.png)

We all see that the world of podcasting is increasingly becoming a walled garden dominated by big players, so returning to its roots, the RSS feed, is both a political act and a matter of survival. To achieve this, we need to create software that meets all the requirements of modern software in terms of functionality, aesthetics, and ease of use, while under the hood, it has a heart made of XML.

The features that Fourviere offers include:

- Creation of RSS feeds with the ability to support all the parameters of podcasting 2.0
- Uploading the feed and assets to S3 or FTP to decouple the creation of the podcast from its hosting (a practice often pushed by hosting providers for feeds). By doing this, we can host our feed on any web space, on a personal server, or even on more advanced cloud providers.
- File editing and transformation features: creation of chapters and store it in the json file and the multimedia file in the form of ID3V2 tags, integration with Podcast Index web services, ChatGPT for creating episode notes, and integrated transcription function.
- Native video tag support: It will be possible to configure the embedded tag for the video quickly, as well as upload the video with the same simplicity. Thanks to the power of FFMPEG integrated into the application, it will also be possible to compress and encode the video and audio files automatically.

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
| windows_x86_64  | N     | Y   | N    | mkl --> msi, exe                       | mkl --> msi, exe      |
 
### FAQ

- Where can I find the link for the linux CUDA version?
  - Unfortunately the pkg2appimage/excludelist does not exclude `libcuda1.so` when grabbing libs dependencies. The library is provided by proprietary Nvidia drivers

- Why CUDA is not supported under Windows environment?
  - See [candle #1882](https://github.com/huggingface/candle/issues/1882)