<p align="center">
  <img src="logo-banner.png" alt="Brigid Logo" />
</p>

---

[中文](README.md)

---

# Brigid

Brigid is a comprehensive open-source **DICOM management and viewing platform**. It focuses on providing a modern, extensible web-based architecture as a learning and experimental project for technologies related to medical imaging systems.

It offers an efficient and flexible solution for **storing, retrieving, sharing, and viewing** medical images in the DICOM format, while integrating a complete image viewing experience.

> [!CAUTION]
> This project is primarily intended for personal practice and technical validation. **Not all features are fully implemented, and it is not recommended for use in a production environment**.  
> If you have any questions or suggestions regarding the project, feel free to open an Issue or submit a Pull Request for discussion.

## Core Features

- **DICOM Standard Support**:
  - DICOMweb (WADO-RS, QIDO-RS, STOW-RS)
  - Traditional DIMSE services (C-ECHO, C-FIND, C-MOVE, C-STORE)
- **Built-in Professional DICOM Viewer**:
  - Integrated with **[BlueLight Viewer](https://github.com/cylab-tw/bluelight)** to provide a smooth web-based medical image viewing experience
- **Tag Management (Tagging)**:
  - Supports custom tags for classification and management of imaging data
- **Sharing and Collaboration**:
  - **Shared Links**: Generate permission-controlled sharing links with support for password protection and expiration
  - **Multi-workspace Architecture (Workspaces)**: Supports multiple workspaces for resource isolation
- **Multilingual Support**:
  - Currently supports English and Traditional Chinese (zh-TW, 繁體中文)
- **OAuth2 Authorization System Integration**:
  - Supports integration with OAuth2 authorization systems
  - Currently supports Casdoor

## Technical Architecture

As a project oriented toward learning and experimentation, Brigid uses a relatively modern technology stack. Below is an overview of the main technical architecture:

- **Frontend**
  - Next.js (App Router)
  - Shadcn UI
  - React Query (Tanstack Query)
  - Zustand
- **Backend**
  - Hono
  - Node.js
- **Database**
  - SQLite
  - TypeORM
- **Authentication**
  - Auth.js
  - TypeORM Adapter
  - Casdoor
- **Development & Tooling Ecosystem**
  - PNPM Workspace
  - Biome
  - Vitest

## Download

Executable versions for Linux and Windows are available on the  
[Releases](https://github.com/Brigid-DICOM/brigid/releases) page.

### Manual Configuration of JRE and OpenCV

If you choose a version **without an embedded JRE**, or use an existing system JRE, you must manually configure the required OpenCV libraries; otherwise, some features may not function properly.

- **Windows**: Copy `data/dcm4che/lib/windows-x86-64/opencv_java.dll` to the JRE `bin` directory
- **Linux**: Copy `data/dcm4che/lib/linux-x86-64/libclib_jiio.so` and `data/dcm4che/lib/linux-x86-64/libopencv_java.so` to the JRE `lib` directory
- **macOS**: Copy `data/dcm4che/lib/macosx-x86-64/*libopencv_java.dylib` to the JRE `lib` directory

## Docker Compose Deployment

For self-hosted deployment, this project also provides **Docker Compose** configuration files. 

You can start the services by following the steps below:

1. **Prepare Environment Variables**:
   - Refer to `apps/web/env.example` to create the corresponding `.env` file and fill in the required environment variables
   - Then choose one of the following:
     - Use `env_file` in `docker-compose.yml` to specify the `.env` file  
     - Or directly define the environment variables in the `environment` section

2. **Start the Services**:

   Run the following command in the project root directory to start all services:

   ```bash
   docker compose up -d

3. **Access the Service**:

    By default, the system can be accessed at `http://localhost:3119`
    
## Authorization System Integration

By default, Brigid does not enable an authorization system. To enable it, set NEXT_PUBLIC_ENABLE_AUTH=true in the .env file and configure the corresponding authorization system settings.

- Currently, Brigid supported authorization systems:
  - Casdoor

### Casdoor

```toml
# AUTH
NEXT_PUBLIC_ENABLE_AUTH=true
NEXTAUTH_SECRET=your-secret-key
AUTH_TRUST_HOST=true

AUTH_CASDOOR_ID=casdoor_id
AUTH_CASDOOR_SECRET=casdoor_secret
AUTH_CASDOOR_ISSUER=https://casdoor.example.com
```

## Project Motivation and Design Trade-offs

Brigid was created as part of my journey in learning new technical architectures and toolchains.
Before this, I had developed another PACS project, [raccoon-dicom](https://github.com/Chinlinlee/raccoon-dicom), which was later moved to an internal company GitLab due to commercialization requirements.

In that project, the image management interface used a single-page design where Studies, Series, and Instances were expanded hierarchically using nested tables.

As the hierarchy deepened, the interface became lengthy, and the nested borders and pagination significantly degraded usability and readability.

Therefore, in Brigid, I chose a different design approach:

- Using a folder-like browsing structure
- Providing a dedicated page for each level (Study / Series / Instance)
- Changing image viewing to a modal-based popup component to enhance the user experience

## Deployment and Usage Considerations

Based on past experience, I have often received feedback such as "deployment is still difficult even with docker-compose."

As a result, this project places special emphasis on improving the first-time user experience, with the goal of achieving run-after-extraction usability.

Currently, Brigid is experimenting with:

- **SEA (Single Executable Application)**
- A well-designed `.env` configuration file with sensible default values

This allows users to start the project with minimal environment setup.

Based on current testing results, this approach appears feasible, though it remains experimental.

## Suitable and Unsuitable Use Cases

### Suitable For

- Engineers who want to learn or research DICOM / PACS-related technologies
- Developers interested in medical imaging system architectures
- Educational use cases for understanding how modern web technologies can be applied in the medical imaging domain

### Unsuitable For

- Formal clinical or medical use
- Production environments requiring compliance with medical regulations or information security certifications
- Systems with strict requirements for stability, compliance, and long-term maintenance

> [!NOTE]
> If you are interested in further developing this project into a **PACS system suitable for production environments**,
> whether by providing technical suggestions, architectural guidance, or related resources,
> you are very welcome to discuss and exchange ideas via Issues or Pull Requests.