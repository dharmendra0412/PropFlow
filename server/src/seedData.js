export const seedData = {
  properties: [
    {
      id: "PROP-01",
      name: "Apex Heights Residences",
      address: "742 Evergreen Terrace, Seattle, WA 98101",
      totalUnits: 120,
      occupiedUnits: 114,
      managerId: "USR-MGR-01",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
      description: "Modern luxury high-rise featuring panoramic skyline views, state-of-the-art facilities, and premier community amenities."
    },
    {
      id: "PROP-02",
      name: "Marina Vista Lofts",
      address: "108 Ocean Boulevard, San Diego, CA 92109",
      totalUnits: 85,
      occupiedUnits: 80,
      managerId: "USR-MGR-02",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
      description: "Coastal boutique apartment community with open concept floorplans, private balconies, and resort-style living."
    }
  ],

  users: [
    {
      id: "USR-TNT-01",
      name: "Sarah Jenkins",
      email: "sarah.jenkins@example.com",
      role: "tenant",
      phone: "+1 (555) 234-5678",
      propertyId: "PROP-01",
      propertyName: "Apex Heights Residences",
      unitNumber: "Unit 402B",
      leaseStart: "2024-01-01",
      leaseEnd: "2025-12-31",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80"
    },
    {
      id: "USR-TNT-02",
      name: "David Chen",
      email: "david.chen@example.com",
      role: "tenant",
      phone: "+1 (555) 876-5432",
      propertyId: "PROP-01",
      propertyName: "Apex Heights Residences",
      unitNumber: "Unit 815A",
      leaseStart: "2024-03-15",
      leaseEnd: "2025-03-14",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80"
    },
    {
      id: "USR-MGR-01",
      name: "Alex Reynolds",
      email: "alex.reynolds@apexheights.com",
      role: "owner", // Property Owner / Manager
      phone: "+1 (555) 901-2345",
      propertyId: "PROP-01",
      propertyName: "Apex Heights Residences",
      title: "Senior Property Manager",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"
    },
    {
      id: "USR-MGR-02",
      name: "Elena Rostova",
      email: "elena.rostova@marinavista.com",
      role: "owner",
      phone: "+1 (555) 345-6789",
      propertyId: "PROP-02",
      propertyName: "Marina Vista Lofts",
      title: "Lead Operations Director",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80"
    }
  ],

  amenities: [
    {
      id: "AMEN-01",
      propertyId: "PROP-01",
      name: "Skyline Rooftop Lounge",
      category: "Social & Event",
      description: "Breathtaking 360° city view lounge equipped with designer lounge seating, catering kitchenette, and firepits.",
      capacity: 40,
      openTime: "08:00",
      closeTime: "23:00",
      slotDuration: 120, // 2 hours
      rules: [
        "Quiet hours start promptly at 10:00 PM",
        "No glass beverage containers in patio zone",
        "Host is responsible for returning kitchenette to clean state",
        "Maximum 2 reservations per week per resident"
      ],
      image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80",
      isAvailable: true
    },
    {
      id: "AMEN-02",
      propertyId: "PROP-01",
      name: "Olympic Lap Pool & Cabanas",
      category: "Fitness & Recreation",
      description: "Heated 25-meter saltwater lap pool flanked by private shaded cabanas and heated outdoor showers.",
      capacity: 25,
      openTime: "06:00",
      closeTime: "22:00",
      slotDuration: 90,
      rules: [
        "Shower required prior to entry",
        "No diving in designated shallow lane",
        "Children under 14 must be accompanied by an adult resident",
        "No outside amplified speakers"
      ],
      image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80",
      isAvailable: true
    },
    {
      id: "AMEN-03",
      propertyId: "PROP-01",
      name: "Equinox-Standard Fitness Center",
      category: "Wellness & Health",
      description: "Comprehensive gym with Peloton bikes, free weights up to 100lbs, functional turf strip, and private yoga studio.",
      capacity: 30,
      openTime: "05:00",
      closeTime: "23:59",
      slotDuration: 60,
      rules: [
        "Wipe down equipment after each use with provided disinfectant wipes",
        "Re-rack all dumbbells and weight plates",
        "Athletic footwear required at all times"
      ],
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
      isAvailable: true
    },
    {
      id: "AMEN-04",
      propertyId: "PROP-01",
      name: "Executive Coworking & Boardroom",
      category: "Business",
      description: "High-speed gigabit Wi-Fi, 4K video conferencing display, conference seating for 12, and gourmet espresso bar.",
      capacity: 12,
      openTime: "07:00",
      closeTime: "21:00",
      slotDuration: 60,
      rules: [
        "Keep volume courteous in common study pods",
        "Boardroom requires advance reservation",
        "Clean whiteboard after session ends"
      ],
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
      isAvailable: true
    },
    {
      id: "AMEN-05",
      propertyId: "PROP-01",
      name: "Gourmet BBQ & Alfresco Pavilion",
      category: "Dining & Grill",
      description: "Dual stainless steel gas grills, granite prep counters, outdoor dining tables, and overhead heating lamps.",
      capacity: 20,
      openTime: "11:00",
      closeTime: "22:00",
      slotDuration: 90,
      rules: [
        "Turn off gas valve firmly after grill use",
        "Brush grill grates while warm",
        "Dispose of all food waste in bear-proof organic bins"
      ],
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
      isAvailable: true
    },
    {
      id: "AMEN-06",
      propertyId: "PROP-01",
      name: "Private Cinema & Screening Room",
      category: "Entertainment",
      description: "Dolby Atmos 13-channel surround sound, 150-inch 4K laser projector, and plush tiered leather recliners for 16 guests.",
      capacity: 16,
      openTime: "12:00",
      closeTime: "23:00",
      slotDuration: 120,
      rules: [
        "No greasy food or messy beverages",
        "Residents must return remote controls to charging dock",
        "Lights must be turned off when leaving"
      ],
      image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
      isAvailable: true
    }
  ],

  maintenanceRequests: [
    {
      id: "REQ-1001",
      propertyId: "PROP-01",
      propertyName: "Apex Heights Residences",
      unitNumber: "Unit 402B",
      tenantId: "USR-TNT-01",
      tenantName: "Sarah Jenkins",
      tenantPhone: "+1 (555) 234-5678",
      title: "Master Bathroom Sink Slow Drain & Mild Leak",
      category: "Plumbing",
      priority: "Medium",
      status: "In Progress",
      assignedTo: "Marcus Thorne (Plumbing Lead)",
      description: "The bathroom sink takes nearly 5 minutes to drain completely and there is a slow dripping leak from the P-trap underneath onto the vanity shelf.",
      createdAt: new Date(Date.now() - 18 * 3600000).toISOString(), // 18 hours ago
      updatedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
      resolvedAt: null,
      resolutionNotes: "",
      comments: [
        {
          id: "CMT-1",
          senderId: "USR-TNT-01",
          senderName: "Sarah Jenkins",
          senderRole: "tenant",
          message: "Noticed this after running the water for shaving yesterday evening. I put a small bowl underneath.",
          timestamp: new Date(Date.now() - 17 * 3600000).toISOString()
        },
        {
          id: "CMT-2",
          senderId: "USR-MGR-01",
          senderName: "Alex Reynolds",
          senderRole: "owner",
          message: "Thank you Sarah! Marcus from maintenance has been assigned and will stop by between 2:00 PM and 3:30 PM today.",
          timestamp: new Date(Date.now() - 2 * 3600000).toISOString()
        }
      ]
    },
    {
      id: "REQ-1002",
      propertyId: "PROP-01",
      propertyName: "Apex Heights Residences",
      unitNumber: "Unit 815A",
      tenantId: "USR-TNT-02",
      tenantName: "David Chen",
      tenantPhone: "+1 (555) 876-5432",
      title: "HVAC Thermostat Display Glitching / Blowing Warm Air",
      category: "HVAC",
      priority: "High",
      status: "Pending",
      assignedTo: "Unassigned",
      description: "The digital thermostat screen keeps flickering error code E-42. The AC is currently blowing room-temperature air despite target set to 70°F.",
      createdAt: new Date(Date.now() - 4 * 3600000).toISOString(), // 4 hours ago
      updatedAt: new Date(Date.now() - 4 * 3600000).toISOString(),
      resolvedAt: null,
      resolutionNotes: "",
      comments: [
        {
          id: "CMT-3",
          senderId: "USR-TNT-02",
          senderName: "David Chen",
          senderRole: "tenant",
          message: "It started around noon today. The temperature inside is rising quickly.",
          timestamp: new Date(Date.now() - 4 * 3600000).toISOString()
        }
      ]
    },
    {
      id: "REQ-1003",
      propertyId: "PROP-01",
      propertyName: "Apex Heights Residences",
      unitNumber: "Unit 402B",
      tenantId: "USR-TNT-01",
      tenantName: "Sarah Jenkins",
      tenantPhone: "+1 (555) 234-5678",
      title: "Kitchen Bosch Dishwasher Drainage Error E24",
      category: "Appliance",
      priority: "Medium",
      status: "Completed",
      assignedTo: "Carlos Ruiz (Appliance Tech)",
      description: "Dishwasher cycle pauses mid-wash with beep and error code E24 indicating pump obstruction.",
      createdAt: new Date(Date.now() - 36 * 3600000).toISOString(), // 36 hours ago
      updatedAt: new Date(Date.now() - 12 * 3600000).toISOString(),
      resolvedAt: new Date(Date.now() - 12 * 3600000).toISOString(), // resolved in 24 hours (well under 48h SLA)
      resolutionNotes: "Cleared small glass fragment obstructing impeller pump and ran test rinse cycle. Verified zero leaks and proper drainage.",
      comments: [
        {
          id: "CMT-4",
          senderId: "USR-TNT-01",
          senderName: "Sarah Jenkins",
          senderRole: "tenant",
          message: "Submitted ticket with photo of error code on panel.",
          timestamp: new Date(Date.now() - 35 * 3600000).toISOString()
        },
        {
          id: "CMT-5",
          senderId: "USR-MGR-01",
          senderName: "Alex Reynolds",
          senderRole: "owner",
          message: "Carlos fixed the impeller pump today. Ticket marked resolved. Please let us know if anything arises!",
          timestamp: new Date(Date.now() - 12 * 3600000).toISOString()
        }
      ]
    },
    {
      id: "REQ-1004",
      propertyId: "PROP-01",
      propertyName: "Apex Heights Residences",
      unitNumber: "Unit 204C",
      tenantId: "USR-TNT-03",
      tenantName: "Michael Chang",
      tenantPhone: "+1 (555) 345-9876",
      title: "Balcony Sliding Door Latch Loose",
      category: "Structural",
      priority: "Low",
      status: "Completed",
      assignedTo: "Marcus Thorne (Plumbing Lead)",
      description: "The interior sliding door handle latch rattles and doesn't catch smoothly on the striker plate.",
      createdAt: new Date(Date.now() - 72 * 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 40 * 3600000).toISOString(),
      resolvedAt: new Date(Date.now() - 40 * 3600000).toISOString(),
      resolutionNotes: "Re-aligned striker plate and secured with heavy-duty screws. Latch operates securely.",
      comments: []
    }
  ],

  amenityBookings: [
    {
      id: "BOOK-2001",
      amenityId: "AMEN-01",
      amenityName: "Skyline Rooftop Lounge",
      propertyId: "PROP-01",
      tenantId: "USR-TNT-01",
      tenantName: "Sarah Jenkins",
      unitNumber: "Unit 402B",
      date: new Date().toISOString().split("T")[0], // Today
      startTime: "18:00",
      endTime: "20:00",
      guestCount: 6,
      purpose: "Family anniversary dinner celebration",
      status: "Confirmed", // Will show check-in option when in time window
      checkInTime: null,
      checkOutTime: null,
      createdAt: new Date(Date.now() - 48 * 3600000).toISOString()
    },
    {
      id: "BOOK-2002",
      amenityId: "AMEN-04",
      amenityName: "Executive Coworking & Boardroom",
      propertyId: "PROP-01",
      tenantId: "USR-TNT-02",
      tenantName: "David Chen",
      unitNumber: "Unit 815A",
      date: new Date().toISOString().split("T")[0], // Today
      startTime: "10:00",
      endTime: "11:00",
      guestCount: 4,
      purpose: "Quarterly investor presentation remote call",
      status: "Checked In",
      checkInTime: new Date(Date.now() - 30 * 60000).toISOString(),
      checkOutTime: null,
      createdAt: new Date(Date.now() - 24 * 3600000).toISOString()
    },
    {
      id: "BOOK-2003",
      amenityId: "AMEN-03",
      amenityName: "Equinox-Standard Fitness Center",
      propertyId: "PROP-01",
      tenantId: "USR-TNT-01",
      tenantName: "Sarah Jenkins",
      unitNumber: "Unit 402B",
      date: new Date(Date.now() - 86400000).toISOString().split("T")[0], // Yesterday
      startTime: "07:00",
      endTime: "08:00",
      guestCount: 1,
      purpose: "Morning spin and strength training",
      status: "Checked Out",
      checkInTime: new Date(Date.now() - 86400000 - 3600000).toISOString(),
      checkOutTime: new Date(Date.now() - 86400000).toISOString(),
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
    }
  ],

  activityLogs: [
    {
      id: "ACT-01",
      type: "MAINTENANCE_CREATED",
      title: "New Maintenance Request #REQ-1002",
      description: "David Chen (Unit 815A) filed high priority ticket: HVAC Thermostat Display Glitching",
      timestamp: new Date(Date.now() - 4 * 3600000).toISOString(),
      userId: "USR-TNT-02",
      userName: "David Chen"
    },
    {
      id: "ACT-02",
      type: "STATUS_UPDATED",
      title: "Request #REQ-1001 In Progress",
      description: "Alex Reynolds assigned Marcus Thorne to bathroom drain issue in Unit 402B",
      timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
      userId: "USR-MGR-01",
      userName: "Alex Reynolds"
    },
    {
      id: "ACT-03",
      type: "AMENITY_CHECKIN",
      title: "Amenity Check-in",
      description: "David Chen checked into Executive Coworking & Boardroom",
      timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
      userId: "USR-TNT-02",
      userName: "David Chen"
    }
  ]
};
