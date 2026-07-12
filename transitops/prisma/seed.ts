import {
  PrismaClient, Role, VehicleType, VehicleStatus,
  DriverStatus, TripStatus, MaintenanceStatus, ExpenseType,
} from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

function daysFromNow(days: number) {
  return new Date(Date.now() + days * 86_400_000)
}

async function main() {
  const passwordHash = await bcrypt.hash('pass123', 10)

  // ── Users ────────────────────────────────────────────────────────────────
  await Promise.all([
    prisma.user.upsert({ where: { email: 'sbbhalani11@gmail.com' },   update: {}, create: { name: 'Smit Bhalani',      email: 'sbbhalani11@gmail.com',   passwordHash, role: Role.FLEET_MANAGER } }),
    prisma.user.upsert({ where: { email: 'sbpro1820@gmail.com' },     update: {}, create: { name: 'Sara Patel',        email: 'sbpro1820@gmail.com',      passwordHash, role: Role.SAFETY_OFFICER } }),
    prisma.user.upsert({ where: { email: 'masterprompt8@gmail.com' }, update: {}, create: { name: 'Max Finance',       email: 'masterprompt8@gmail.com',  passwordHash, role: Role.FINANCIAL_ANALYST } }),
    prisma.user.upsert({ where: { email: 'smartmax650@gmail.com' },   update: {}, create: { name: 'Alex Driver',       email: 'smartmax650@gmail.com',    passwordHash, role: Role.DRIVER } }),
  ])
  console.log('✓ Users')

  // ── Vehicles (10) ────────────────────────────────────────────────────────
  const vehicleData = [
    { registrationNumber: 'VAN-001', name: 'Ford Transit 1',    type: VehicleType.VAN,        maxLoadCapacityKg: 1200,  odometerKm: 18500,  acquisitionCost: 38000,  status: VehicleStatus.AVAILABLE, region: 'North' },
    { registrationNumber: 'VAN-002', name: 'Ford Transit 2',    type: VehicleType.VAN,        maxLoadCapacityKg: 1200,  odometerKm: 24300,  acquisitionCost: 38000,  status: VehicleStatus.ON_TRIP,   region: 'South' },
    { registrationNumber: 'TRK-001', name: 'Volvo FH 1',        type: VehicleType.TRUCK,      maxLoadCapacityKg: 18000, odometerKm: 92000,  acquisitionCost: 145000, status: VehicleStatus.AVAILABLE, region: 'East'  },
    { registrationNumber: 'TRK-002', name: 'Volvo FH 2',        type: VehicleType.TRUCK,      maxLoadCapacityKg: 18000, odometerKm: 110000, acquisitionCost: 145000, status: VehicleStatus.IN_SHOP,   region: 'West'  },
    { registrationNumber: 'TRK-003', name: 'Mercedes Actros',   type: VehicleType.TRUCK,      maxLoadCapacityKg: 20000, odometerKm: 76000,  acquisitionCost: 160000, status: VehicleStatus.AVAILABLE, region: 'North' },
    { registrationNumber: 'MTR-001', name: 'Tata Ace 1',        type: VehicleType.MINI_TRUCK, maxLoadCapacityKg: 3500,  odometerKm: 31000,  acquisitionCost: 52000,  status: VehicleStatus.AVAILABLE, region: 'South' },
    { registrationNumber: 'MTR-002', name: 'Tata Ace 2',        type: VehicleType.MINI_TRUCK, maxLoadCapacityKg: 3500,  odometerKm: 44000,  acquisitionCost: 52000,  status: VehicleStatus.ON_TRIP,   region: 'East'  },
    { registrationNumber: 'BUS-001', name: 'Ashok Leyland Bus', type: VehicleType.BUS,        maxLoadCapacityKg: 6000,  odometerKm: 58000,  acquisitionCost: 95000,  status: VehicleStatus.AVAILABLE, region: 'West'  },
    { registrationNumber: 'OTH-001', name: 'Pickup Truck 1',    type: VehicleType.OTHER,      maxLoadCapacityKg: 800,   odometerKm: 9200,   acquisitionCost: 28000,  status: VehicleStatus.AVAILABLE, region: 'North' },
    { registrationNumber: 'VAN-003', name: 'Ford Transit 3',    type: VehicleType.VAN,        maxLoadCapacityKg: 1200,  odometerKm: 5100,   acquisitionCost: 38000,  status: VehicleStatus.RETIRED,   region: 'South' },
  ]

  const vehicles: Awaited<ReturnType<typeof prisma.vehicle.upsert>>[] = []
  for (const v of vehicleData) {
    vehicles.push(await prisma.vehicle.upsert({ where: { registrationNumber: v.registrationNumber }, update: {}, create: v }))
  }
  console.log('✓ Vehicles')

  // ── Drivers (10) ─────────────────────────────────────────────────────────
  const driverData = [
    { name: 'James Carter',   email: 'james.carter@transitops.com',   licenseNumber: 'DL-1001', licenseCategory: 'C', licenseExpiryDate: daysFromNow(365),  contactNumber: '555-1001', safetyScore: 97,  status: DriverStatus.AVAILABLE },
    { name: 'Maria Lopez',    email: 'maria.lopez@transitops.com',    licenseNumber: 'DL-1002', licenseCategory: 'C', licenseExpiryDate: daysFromNow(180),  contactNumber: '555-1002', safetyScore: 94,  status: DriverStatus.ON_TRIP   },
    { name: 'David Kim',      email: 'david.kim@transitops.com',      licenseNumber: 'DL-1003', licenseCategory: 'D', licenseExpiryDate: daysFromNow(20),   contactNumber: '555-1003', safetyScore: 88,  status: DriverStatus.AVAILABLE },
    { name: 'Priya Sharma',   email: 'priya.sharma@transitops.com',   licenseNumber: 'DL-1004', licenseCategory: 'C', licenseExpiryDate: daysFromNow(12),   contactNumber: '555-1004', safetyScore: 91,  status: DriverStatus.ON_TRIP   },
    { name: 'Tom Nguyen',     email: 'tom.nguyen@transitops.com',     licenseNumber: 'DL-1005', licenseCategory: 'C', licenseExpiryDate: daysFromNow(-10),  contactNumber: '555-1005', safetyScore: 76,  status: DriverStatus.OFF_DUTY  },
    { name: 'Sarah Mitchell', email: 'sarah.mitchell@transitops.com', licenseNumber: 'DL-1006', licenseCategory: 'B', licenseExpiryDate: daysFromNow(400),  contactNumber: '555-1006', safetyScore: 100, status: DriverStatus.AVAILABLE },
    { name: 'Carlos Ruiz',    email: 'carlos.ruiz@transitops.com',    licenseNumber: 'DL-1007', licenseCategory: 'C', licenseExpiryDate: daysFromNow(290),  contactNumber: '555-1007', safetyScore: 83,  status: DriverStatus.SUSPENDED },
    { name: 'Emily Chen',     email: 'emily.chen@transitops.com',     licenseNumber: 'DL-1008', licenseCategory: 'D', licenseExpiryDate: daysFromNow(500),  contactNumber: '555-1008', safetyScore: 96,  status: DriverStatus.AVAILABLE },
    { name: 'Raj Patel',      email: 'raj.patel@transitops.com',      licenseNumber: 'DL-1009', licenseCategory: 'C', licenseExpiryDate: daysFromNow(60),   contactNumber: '555-1009', safetyScore: 79,  status: DriverStatus.OFF_DUTY  },
    { name: 'Nina Okafor',    email: 'nina.okafor@transitops.com',    licenseNumber: 'DL-1010', licenseCategory: 'C', licenseExpiryDate: daysFromNow(730),  contactNumber: '555-1010', safetyScore: 99,  status: DriverStatus.AVAILABLE },
  ]

  const drivers: Awaited<ReturnType<typeof prisma.driver.upsert>>[] = []
  for (const d of driverData) {
    drivers.push(await prisma.driver.upsert({ where: { licenseNumber: d.licenseNumber }, update: {}, create: d }))
  }
  console.log('✓ Drivers')

  // ── Clear dependent data before re-seeding ────────────────────────────────
  await prisma.fuelLog.deleteMany({})
  await prisma.expense.deleteMany({})
  await prisma.maintenanceLog.deleteMany({})
  await prisma.trip.deleteMany({})

  // ── Trips (15) ───────────────────────────────────────────────────────────
  // Pairs: [vehicleIndex, driverIndex]
  const tripDefs = [
    // COMPLETED (7)
    { vi: 0, di: 0, src: 'Mumbai Warehouse',    dst: 'Pune Distribution',   kg: 950,  planned: 148, actual: 152, fuel: 28,  rev: 1850, daysAgo: 30 },
    { vi: 2, di: 1, src: 'Delhi Hub',           dst: 'Jaipur Depot',        kg: 14000,planned: 270, actual: 275, fuel: 95,  rev: 6200, daysAgo: 25 },
    { vi: 5, di: 3, src: 'Chennai Port',        dst: 'Bangalore Store',     kg: 2800, planned: 346, actual: 350, fuel: 62,  rev: 3400, daysAgo: 20 },
    { vi: 0, di: 5, src: 'Kolkata Yard',        dst: 'Bhubaneswar Depot',   kg: 1100, planned: 440, actual: 445, fuel: 72,  rev: 2900, daysAgo: 15 },
    { vi: 4, di: 7, src: 'Hyderabad Hub',       dst: 'Vijayawada Store',    kg: 16000,planned: 275, actual: 280, fuel: 98,  rev: 7100, daysAgo: 12 },
    { vi: 6, di: 3, src: 'Ahmedabad Depot',     dst: 'Surat Warehouse',     kg: 3200, planned: 265, actual: 268, fuel: 48,  rev: 2600, daysAgo: 8  },
    { vi: 2, di: 9, src: 'Nagpur Hub',          dst: 'Indore Distribution', kg: 15500,planned: 320, actual: 325, fuel: 112, rev: 6800, daysAgo: 5  },
    // DISPATCHED (3)
    { vi: 1, di: 1, src: 'Mumbai Port',         dst: 'Nashik Depot',        kg: 1100, planned: 165, actual: null, fuel: null, rev: null, daysAgo: 0, dispatched: true },
    { vi: 6, di: 3, src: 'Coimbatore Yard',     dst: 'Madurai Store',       kg: 3000, planned: 210, actual: null, fuel: null, rev: null, daysAgo: 0, dispatched: true },
    { vi: 4, di: 7, src: 'Lucknow Hub',         dst: 'Kanpur Depot',        kg: 17000,planned: 85,  actual: null, fuel: null, rev: null, daysAgo: 0, dispatched: true },
    // DRAFT (3)
    { vi: 0, di: 0, src: 'Pune Warehouse',      dst: 'Aurangabad Store',    kg: 800,  planned: 235, actual: null, fuel: null, rev: null, daysAgo: 0 },
    { vi: 8, di: 5, src: 'Gurgaon Hub',         dst: 'Faridabad Depot',     kg: 700,  planned: 32,  actual: null, fuel: null, rev: null, daysAgo: 0 },
    { vi: 5, di: 9, src: 'Kochi Port',          dst: 'Trivandrum Store',    kg: 2500, planned: 215, actual: null, fuel: null, rev: null, daysAgo: 0 },
    // CANCELLED (2)
    { vi: 3, di: 2, src: 'Bhopal Depot',        dst: 'Jabalpur Store',      kg: 14000,planned: 295, actual: null, fuel: null, rev: null, daysAgo: 18, cancelled: true },
    { vi: 0, di: 4, src: 'Patna Hub',           dst: 'Ranchi Depot',        kg: 900,  planned: 320, actual: null, fuel: null, rev: null, daysAgo: 10, cancelled: true },
  ]

  const trips: Awaited<ReturnType<typeof prisma.trip.create>>[] = []
  for (const t of tripDefs) {
    const status = t.cancelled ? TripStatus.CANCELLED
      : t.dispatched ? TripStatus.DISPATCHED
      : t.actual != null ? TripStatus.COMPLETED
      : TripStatus.DRAFT

    const createdAt = daysFromNow(-t.daysAgo)
    const dispatchedAt = (status === TripStatus.DISPATCHED || status === TripStatus.COMPLETED || status === TripStatus.CANCELLED)
      ? new Date(createdAt.getTime() + 3_600_000) : null
    const completedAt = status === TripStatus.COMPLETED
      ? new Date(createdAt.getTime() + 86_400_000) : null

    trips.push(await prisma.trip.create({
      data: {
        source: t.src, destination: t.dst,
        cargoWeightKg: t.kg, plannedDistanceKm: t.planned,
        actualDistanceKm: t.actual ?? undefined,
        fuelConsumedLiters: t.fuel ?? undefined,
        revenue: t.rev ?? undefined,
        status, createdAt, dispatchedAt, completedAt,
        vehicleId: vehicles[t.vi].id,
        driverId: drivers[t.di].id,
      }
    }))
  }
  console.log('✓ Trips')

  // ── Maintenance Logs (8) ─────────────────────────────────────────────────
  const maintDefs = [
    { vi: 3, desc: 'Engine overhaul — cylinder head gasket replacement',  cost: 4200,  daysAgo: 14, open: true  },
    { vi: 1, desc: 'Brake pad & rotor replacement (front axle)',           cost: 850,   daysAgo: 40, open: false },
    { vi: 6, desc: 'Transmission fluid flush and filter change',           cost: 320,   daysAgo: 60, open: false },
    { vi: 2, desc: 'Tyre replacement — all 6 tyres',                       cost: 3600,  daysAgo: 5,  open: true  },
    { vi: 4, desc: 'Air filter and fuel filter service',                   cost: 180,   daysAgo: 90, open: false },
    { vi: 0, desc: 'Suspension spring replacement (rear)',                 cost: 1100,  daysAgo: 3,  open: true  },
    { vi: 7, desc: 'AC compressor repair and refrigerant recharge',        cost: 760,   daysAgo: 55, open: false },
    { vi: 5, desc: 'Electrical fault — alternator and battery replacement',cost: 950,   daysAgo: 1,  open: true  },
  ]

  for (const m of maintDefs) {
    const startDate = daysFromNow(-m.daysAgo)
    const endDate = m.open ? null : new Date(startDate.getTime() + 3 * 86_400_000)
    await prisma.maintenanceLog.create({
      data: {
        description: m.desc, cost: m.cost,
        startDate, endDate,
        status: m.open ? MaintenanceStatus.OPEN : MaintenanceStatus.CLOSED,
        vehicleId: vehicles[m.vi].id,
      }
    })
  }
  console.log('✓ Maintenance Logs')

  // ── Fuel Logs (20) ───────────────────────────────────────────────────────
  const fuelDefs = [
    { vi: 0, liters: 45,  cost: 72.0,  daysAgo: 28 },
    { vi: 0, liters: 50,  cost: 80.0,  daysAgo: 14 },
    { vi: 1, liters: 48,  cost: 76.8,  daysAgo: 3  },
    { vi: 2, liters: 120, cost: 192.0, daysAgo: 24 },
    { vi: 2, liters: 135, cost: 216.0, daysAgo: 10 },
    { vi: 2, liters: 110, cost: 176.0, daysAgo: 4  },
    { vi: 3, liters: 95,  cost: 152.0, daysAgo: 50 },
    { vi: 4, liters: 140, cost: 224.0, daysAgo: 11 },
    { vi: 4, liters: 128, cost: 204.8, daysAgo: 5  },
    { vi: 5, liters: 65,  cost: 104.0, daysAgo: 19 },
    { vi: 5, liters: 70,  cost: 112.0, daysAgo: 7  },
    { vi: 6, liters: 72,  cost: 115.2, daysAgo: 2  },
    { vi: 7, liters: 85,  cost: 136.0, daysAgo: 35 },
    { vi: 7, liters: 90,  cost: 144.0, daysAgo: 16 },
    { vi: 8, liters: 38,  cost: 60.8,  daysAgo: 22 },
    { vi: 8, liters: 42,  cost: 67.2,  daysAgo: 9  },
    { vi: 0, liters: 52,  cost: 83.2,  daysAgo: 6  },
    { vi: 2, liters: 118, cost: 188.8, daysAgo: 1  },
    { vi: 4, liters: 132, cost: 211.2, daysAgo: 2  },
    { vi: 5, liters: 68,  cost: 108.8, daysAgo: 1  },
  ]

  for (const f of fuelDefs) {
    await prisma.fuelLog.create({
      data: {
        liters: f.liters, cost: f.cost,
        date: daysFromNow(-f.daysAgo),
        vehicleId: vehicles[f.vi].id,
      }
    })
  }
  console.log('✓ Fuel Logs')

  // ── Expenses (10) ────────────────────────────────────────────────────────
  const expenseDefs = [
    { vi: 0, type: ExpenseType.TOLL,        amount: 45.0,  notes: 'Mumbai–Pune expressway toll',          daysAgo: 28 },
    { vi: 2, type: ExpenseType.TOLL,        amount: 120.0, notes: 'Delhi–Jaipur NH-48 toll charges',      daysAgo: 24 },
    { vi: 4, type: ExpenseType.TOLL,        amount: 95.0,  notes: 'Hyderabad–Vijayawada NH-65 toll',      daysAgo: 11 },
    { vi: 1, type: ExpenseType.MAINTENANCE, amount: 280.0, notes: 'Oil change and filter service',        daysAgo: 20 },
    { vi: 3, type: ExpenseType.MAINTENANCE, amount: 650.0, notes: 'Clutch plate replacement',             daysAgo: 45 },
    { vi: 7, type: ExpenseType.MAINTENANCE, amount: 420.0, notes: 'Power steering fluid and pump check',  daysAgo: 30 },
    { vi: 5, type: ExpenseType.OTHER,       amount: 180.0, notes: 'Driver overnight accommodation',       daysAgo: 19 },
    { vi: 6, type: ExpenseType.OTHER,       amount: 95.0,  notes: 'Cargo loading/unloading labour',       daysAgo: 7  },
    { vi: 8, type: ExpenseType.OTHER,       amount: 60.0,  notes: 'Parking fees — Gurgaon depot',         daysAgo: 9  },
    { vi: 2, type: ExpenseType.TOLL,        amount: 140.0, notes: 'Nagpur–Indore NH-44 toll charges',     daysAgo: 5  },
  ]

  for (const e of expenseDefs) {
    await prisma.expense.create({
      data: {
        type: e.type, amount: e.amount, notes: e.notes,
        date: daysFromNow(-e.daysAgo),
        vehicleId: vehicles[e.vi].id,
      }
    })
  }
  console.log('✓ Expenses')

  console.log('\n🌱 Seed completed successfully!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
