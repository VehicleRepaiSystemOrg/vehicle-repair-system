Project architecture (short guide)

Core (singleton services)
- src/app/core/services
  - AuthService, ApiService, AppointmentService, DashboardService
- src/app/core/guards
- src/app/core/interceptors
- src/app/core/models

Shared (reusable UI)
- src/app/shared/components
  - StatCardComponent, LoadingSpinner, DataTable
- src/app/shared/pipes
- src/app/shared/directives

Features (domain-specific)
- src/app/features/<feature>/**
  - pages/ (routable views)
  - components/ (private components used by feature)

Layout
- src/app/layout/* (header, sidebar, footer, main-layout)

Rules
- Do not put singleton services inside feature folders. Place them in `core/services`.
- Shared components must not depend on feature-specific services or modules.
- Core should not import from Features or Shared that create circular dependencies.
