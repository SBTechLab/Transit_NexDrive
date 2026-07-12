export const getForgotPasswordTemplate = (resetUrl: string) => `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2>Reset Your TransitOps Password</h2>
  <p>You requested a password reset. Click the button below to set a new password. This link expires in 30 minutes.</p>
  <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
  <p style="margin-top: 20px; color: #666; font-size: 12px;">If you did not request this, please ignore this email.</p>
</div>
`;

export const getPasswordChangedTemplate = () => `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2>Password Successfully Changed</h2>
  <p>Your TransitOps password has been successfully updated.</p>
  <p style="margin-top: 20px; color: #666; font-size: 12px;">If you did not make this change, please contact your administrator immediately.</p>
</div>
`;

export const getNewUserTemplate = (loginUrl: string, tempPassword: string) => `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2>Welcome to TransitOps</h2>
  <p>An account has been created for you by your Fleet Manager.</p>
  <p>Your temporary password is: <strong>${tempPassword}</strong></p>
  <p>You will be required to change your password upon your first login.</p>
  <a href="${loginUrl}" style="display: inline-block; padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none; border-radius: 5px;">Log In Now</a>
</div>
`;

export const getTripDispatchedTemplate = (tripDetails: { id: string, source: string, destination: string, cargoWeightKg: number }) => `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2>Trip Dispatched</h2>
  <p>You have been assigned Trip #${tripDetails.id}:</p>
  <ul>
    <li><strong>Source:</strong> ${tripDetails.source}</li>
    <li><strong>Destination:</strong> ${tripDetails.destination}</li>
    <li><strong>Cargo Weight:</strong> ${tripDetails.cargoWeightKg} kg</li>
  </ul>
  <p>Please review your dashboard for full details.</p>
</div>
`;

export const getTripCompletedTemplate = (tripDetails: { id: string, distance: number, fuel: number, cost: number }) => `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2>Trip Completed</h2>
  <p>Trip #${tripDetails.id} has been marked as completed.</p>
  <ul>
    <li><strong>Actual Distance:</strong> ${tripDetails.distance} km</li>
    <li><strong>Fuel Consumed:</strong> ${tripDetails.fuel} L</li>
    <li><strong>Estimated Cost:</strong> $${tripDetails.cost.toFixed(2)}</li>
  </ul>
</div>
`;

export const getTripCancelledTemplate = (tripId: string) => `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2>Trip Cancelled</h2>
  <p>Trip #${tripId} has been cancelled.</p>
</div>
`;

export const getLicenseExpiringTemplate = (driverName: string, daysLeft: number) => `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2>License Expiry Warning</h2>
  <p>This is a reminder that the driver license for <strong>${driverName}</strong> is expiring in ${daysLeft} days.</p>
  <p>Please take action immediately to renew the documentation and avoid suspension.</p>
</div>
`;

export const getDriverSuspendedTemplate = (driverName: string) => `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #ef4444;">Driver Suspended</h2>
  <p>Driver <strong>${driverName}</strong> has been suspended from duty.</p>
  <p>All active trips for this driver should be reassigned immediately.</p>
</div>
`;

export const getMaintenanceOpenedTemplate = (vehicleReg: string) => `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2>Vehicle In Shop</h2>
  <p>Vehicle <strong>${vehicleReg}</strong> has been moved to maintenance (IN_SHOP).</p>
</div>
`;

export const getMaintenanceClosedTemplate = (vehicleReg: string) => `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2>Vehicle Available</h2>
  <p>Maintenance on vehicle <strong>${vehicleReg}</strong> is complete. It is now AVAILABLE.</p>
</div>
`;
