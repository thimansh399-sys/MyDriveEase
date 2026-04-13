# DriveEase User & Driver Flow

```mermaid
flowchart TD
  Home[/Home/]
  Login[/Login/]
  Signup[/Signup/]
  BookRide[/Book Ride/]
  Drivers[/Drivers/]
  TrackRide[/Track Ride/]
  Payment[/Payment/]
  RateRide[/Rate Ride/]
  MyRides[/My Rides/]
  Profile[/Profile/]
  Plans[/Plans/]
  Insurance[/Insurance/]
  LiveMap[/Live Map/]

  Home -->|Find Drivers / Book Ride| BookRide
  BookRide -->|If not logged in| Login
  Login -->|After login| BookRide
  BookRide -->|Find Drivers| Drivers
  Drivers -->|Select Driver / Auto-assign| TrackRide
  TrackRide -->|Ride ends| Payment
  Payment --> RateRide
  RateRide --> MyRides
  MyRides --> Profile
  Home --> Plans
  Home --> Insurance
  Home --> LiveMap

  subgraph Driver
    DriverLogin[/Login as Driver/]
    DriverDashboard[/Driver Dashboard/]
    DriverRides[/Driver Rides/]
    DriverProfile[/Driver Profile/]
    DriverLogin --> DriverDashboard
    DriverDashboard -->|Go Online| DriverRides
    DriverRides -->|Accept Ride| DriverRides
    DriverRides -->|End Ride| DriverDashboard
    DriverDashboard --> DriverProfile
  end

  Home --> Signup
  Signup --> Login
```

---

- Paste this diagram in your README.md or any Markdown file to view it in VS Code with the Mermaid extension, or use an online Mermaid live editor.
- This flow matches your current app navigation and logic.
