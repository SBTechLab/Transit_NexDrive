import { PrismaClient, Role, VehicleType, VehicleStatus, DriverStatus, TripStatus } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Hash password
  const passwordHash = await bcrypt.hash('password123', 10)

  // Create Users
  const fleetManager1 = await prisma.user.upsert({
    where: { email: 'manager1@transitops.com' },
    update: {},
    create: {
      name: 'Alice Fleet',
      email: 'manager1@transitops.com',
      passwordHash,
      role: Role.FLEET_MANAGER,
    },
  })

  const fleetManager2 = await prisma.user.upsert({
    where: { email: 'manager2@transitops.com' },
    update: {},
    create: {
      name: 'Bob Manager',
      email: 'manager2@transitops.com',
      passwordHash,
      role: Role.FLEET_MANAGER,
    },
  })

  const driverUser = await prisma.user.upsert({
    where: { email: 'driver@transitops.com' },
    update: {},
    create: {
      name: 'Charlie Driver',
      email: 'driver@transitops.com',
      passwordHash,
      role: Role.DRIVER,
    },
  })

  const safetyOfficer = await prisma.user.upsert({
    where: { email: 'safety@transitops.com' },
    update: {},
    create: {
      name: 'Dana Safety',
      email: 'safety@transitops.com',
      passwordHash,
      role: Role.SAFETY_OFFICER,
    },
  })

  const financialAnalyst = await prisma.user.upsert({
    where: { email: 'finance@transitops.com' },
    update: {},
    create: {
      name: 'Eve Finance',
      email: 'finance@transitops.com',
      passwordHash,
      role: Role.FINANCIAL_ANALYST,
    },
  })

  console.log('Users created')

  // Create Vehicles
  const vehicles = [
    { registrationNumber: 'VAN-01', name: 'Ford Transit 1', type: VehicleType.VAN, maxLoadCapacityKg: 1000, odometerKm: 15000, acquisitionCost: 35000, status: VehicleStatus.AVAILABLE, region: 'North' },
    { registrationNumber: 'VAN-02', name: 'Ford Transit 2', type: VehicleType.VAN, maxLoadCapacityKg: 1000, odometerKm: 12000, acquisitionCost: 35000, status: VehicleStatus.ON_TRIP, region: 'South' },
    { registrationNumber: 'TRK-01', name: 'Volvo Truck 1', type: VehicleType.TRUCK, maxLoadCapacityKg: 15000, odometerKm: 85000, acquisitionCost: 120000, status: VehicleStatus.AVAILABLE, region: 'East' },
    { registrationNumber: 'TRK-02', name: 'Volvo Truck 2', type: VehicleType.TRUCK, maxLoadCapacityKg: 15000, odometerKm: 90000, acquisitionCost: 120000, status: VehicleStatus.IN_SHOP, region: 'West' },
    { registrationNumber: 'VAN-05', name: 'Demo Van', type: VehicleType.VAN, maxLoadCapacityKg: 500, odometerKm: 5000, acquisitionCost: 25000, status: VehicleStatus.AVAILABLE, region: 'North' },
    { registrationNumber: 'BUS-01', name: 'City Bus 1', type: VehicleType.BUS, maxLoadCapacityKg: 5000, odometerKm: 45000, acquisitionCost: 80000, status: VehicleStatus.AVAILABLE, region: 'South' },
    { registrationNumber: 'MTR-01', name: 'Mini Truck 1', type: VehicleType.MINI_TRUCK, maxLoadCapacityKg: 3000, odometerKm: 25000, acquisitionCost: 45000, status: VehicleStatus.RETIRED, region: 'East' },
    { registrationNumber: 'VAN-03', name: 'Ford Transit 3', type: VehicleType.VAN, maxLoadCapacityKg: 1000, odometerKm: 18000, acquisitionCost: 35000, status: VehicleStatus.AVAILABLE, region: 'West' },
  ]

  const createdVehicles = []
  for (const v of vehicles) {
    const created = await prisma.vehicle.upsert({
      where: { registrationNumber: v.registrationNumber },
      update: {},
      create: v,
    })
    createdVehicles.push(created)
  }
  console.log('Vehicles created')

  // Create Drivers
  const nextYear = new Date()
  nextYear.setFullYear(nextYear.getFullYear() + 1)
  
  const lastMonth = new Date()
  lastMonth.setMonth(lastMonth.getMonth() - 1)

  const drivers = [
    { name: 'John Doe', licenseNumber: 'LIC-001', licenseCategory: 'C', licenseExpiryDate: nextYear, contactNumber: '555-0101', safetyScore: 95, status: DriverStatus.AVAILABLE },
    { name: 'Jane Smith', licenseNumber: 'LIC-002', licenseCategory: 'C', licenseExpiryDate: nextYear, contactNumber: '555-0102', safetyScore: 98, status: DriverStatus.ON_TRIP },
    { name: 'Mike Johnson', licenseNumber: 'LIC-003', licenseCategory: 'D', licenseExpiryDate: lastMonth, contactNumber: '555-0103', safetyScore: 85, status: DriverStatus.AVAILABLE }, // Expired
    { name: 'Sarah Williams', licenseNumber: 'LIC-004', licenseCategory: 'C', licenseExpiryDate: nextYear, contactNumber: '555-0104', safetyScore: 70, status: DriverStatus.SUSPENDED },
    { name: 'Tom Brown', licenseNumber: 'LIC-005', licenseCategory: 'C', licenseExpiryDate: nextYear, contactNumber: '555-0105', safetyScore: 92, status: DriverStatus.OFF_DUTY },
    { name: 'Emily Davis', licenseNumber: 'LIC-006', licenseCategory: 'B', licenseExpiryDate: nextYear, contactNumber: '555-0106', safetyScore: 100, status: DriverStatus.AVAILABLE },
    { name: 'Alex Demo', licenseNumber: 'LIC-007', licenseCategory: 'C', licenseExpiryDate: nextYear, contactNumber: '555-0107', safetyScore: 100, status: DriverStatus.AVAILABLE },
    { name: 'Chris Wilson', licenseNumber: 'LIC-008', licenseCategory: 'D', licenseExpiryDate: nextYear, contactNumber: '555-0108', safetyScore: 88, status: DriverStatus.AVAILABLE },
  ]

  const createdDrivers = []
  for (const d of drivers) {
    const created = await prisma.driver.upsert({
      where: { licenseNumber: d.licenseNumber },
      update: {},
      create: d,
    })
    createdDrivers.push(created)
  }
  console.log('Drivers created')

  // Create Trips
  const vAvailable = createdVehicles.find(v => v.status === VehicleStatus.AVAILABLE)
  const dAvailable = createdDrivers.find(d => d.status === DriverStatus.AVAILABLE)
  
  if (vAvailable && dAvailable) {
    await prisma.trip.create({
      data: {
        source: 'Warehouse A',
        destination: 'Store B',
        cargoWeightKg: 400,
        plannedDistanceKm: 50,
        status: TripStatus.DRAFT,
        vehicleId: vAvailable.id,
        driverId: dAvailable.id,
      }
    })
  }
  
  const vOnTrip = createdVehicles.find(v => v.status === VehicleStatus.ON_TRIP)
  const dOnTrip = createdDrivers.find(d => d.status === DriverStatus.ON_TRIP)
  
  if (vOnTrip && dOnTrip) {
    await prisma.trip.create({
      data: {
        source: 'Port',
        destination: 'Distribution Center',
        cargoWeightKg: 800,
        plannedDistanceKm: 120,
        status: TripStatus.DISPATCHED,
        dispatchedAt: new Date(),
        vehicleId: vOnTrip.id,
        driverId: dOnTrip.id,
      }
    })
  }

  // Create some completed trips
  for(let i = 0; i < 5; i++) {
     const v = createdVehicles[i % createdVehicles.length]
     const d = createdDrivers[i % createdDrivers.length]
     await prisma.trip.create({
      data: {
        source: `City ${i}`,
        destination: `City ${i+1}`,
        cargoWeightKg: 300,
        plannedDistanceKm: 100,
        actualDistanceKm: 105,
        fuelConsumedLiters: 15,
        status: TripStatus.COMPLETED,
        revenue: 500,
        dispatchedAt: new Date(Date.now() - 86400000 * 2),
        completedAt: new Date(Date.now() - 86400000),
        vehicleId: v.id,
        driverId: d.id,
      }
    })
  }

  console.log('Trips created')

  console.log('Seed completed successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
