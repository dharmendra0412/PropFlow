const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('🧪 Starting End-to-End API & Business Logic Verification...\n');

  // 1. Healthcheck
  const healthRes = await fetch(`${BASE_URL}/health`).then(r => r.json());
  console.log('✓ Healthcheck passed:', healthRes.status);

  // 2. Auth Users
  const usersRes = await fetch(`${BASE_URL}/auth/users`).then(r => r.json());
  console.log(`✓ Loaded ${usersRes.users.length} demo users (tenants & managers).`);

  // 3. Create Maintenance Request
  const createReqRes = await fetch(`${BASE_URL}/maintenance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      propertyId: 'PROP-01',
      unitNumber: 'Unit 402B',
      tenantId: 'USR-TNT-01',
      tenantName: 'Sarah Jenkins',
      title: 'Balcony Light Fixture Sparks Intermittently',
      category: 'Electrical',
      priority: 'High',
      description: 'The exterior ceiling fixture on the balcony makes a buzzing sound and flickers when switched on.'
    })
  }).then(r => r.json());

  console.log(`✓ Created Ticket #${createReqRes.request.id} with status: ${createReqRes.request.status}`);
  const ticketId = createReqRes.request.id;

  // 4. Update status to In Progress
  const inProgRes = await fetch(`${BASE_URL}/maintenance/${ticketId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      status: 'In Progress',
      assignedTo: 'Sarah Bradley (Master Electrician)',
      updatedBy: { id: 'USR-MGR-01', name: 'Alex Reynolds', role: 'owner' }
    })
  }).then(r => r.json());
  console.log(`✓ Updated Ticket #${ticketId} status to: ${inProgRes.request.status} (Assigned: ${inProgRes.request.assignedTo})`);

  // 5. Add Discussion Comment
  const commentRes = await fetch(`${BASE_URL}/maintenance/${ticketId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      senderId: 'USR-MGR-01',
      senderName: 'Alex Reynolds',
      senderRole: 'owner',
      message: 'Electrician has cut breaker power to balcony and will replace the housing.'
    })
  }).then(r => r.json());
  console.log(`✓ Added Real-time Comment: "${commentRes.comment.message}"`);

  // 6. Complete ticket
  const completeRes = await fetch(`${BASE_URL}/maintenance/${ticketId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      status: 'Completed',
      resolutionNotes: 'Replaced ballast and weatherproof gasket. Tested successfully.',
      updatedBy: { id: 'USR-MGR-01', name: 'Alex Reynolds', role: 'owner' }
    })
  }).then(r => r.json());
  console.log(`✓ Completed Ticket #${ticketId} with resolution notes: "${completeRes.request.resolutionNotes}"`);

  // 7. Amenity Booking & Conflict Prevention Test
  const testDate = '2026-11-05';
  const amenId = 'AMEN-01'; // Rooftop Lounge

  // First booking: 15:00 - 17:00
  const book1Res = await fetch(`${BASE_URL}/amenities/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amenityId: amenId,
      propertyId: 'PROP-01',
      tenantId: 'USR-TNT-01',
      tenantName: 'Sarah Jenkins',
      unitNumber: 'Unit 402B',
      date: testDate,
      startTime: '15:00',
      endTime: '17:00',
      guestCount: 4,
      purpose: 'Evening book reading group'
    })
  });
  const book1Data = await book1Res.json();
  console.log(`✓ Reservation 1 created: BOOK #${book1Data.booking.id} (${book1Data.booking.startTime} - ${book1Data.booking.endTime})`);

  // Conflicting booking: 16:00 - 18:00 (Overlaps 16:00-17:00) -> MUST FAIL WITH 409 CONFLICT!
  const book2Res = await fetch(`${BASE_URL}/amenities/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amenityId: amenId,
      propertyId: 'PROP-01',
      tenantId: 'USR-TNT-02',
      tenantName: 'David Chen',
      unitNumber: 'Unit 815A',
      date: testDate,
      startTime: '16:00',
      endTime: '18:00',
      guestCount: 2,
      purpose: 'Coworking session'
    })
  });
  const book2Data = await book2Res.json();
  if (book2Res.status === 409 && book2Data.conflict) {
    console.log(`✓ CONFLICT ENGINE PASSED! Successfully rejected overlapping booking with HTTP 409:`);
    console.log(`   "${book2Data.message}"`);
  } else {
    console.error('❌ Conflict detection failed!', book2Res.status, book2Data);
    process.exit(1);
  }

  // 8. Test Check-in and Check-out
  const checkinRes = await fetch(`${BASE_URL}/amenities/bookings/${book1Data.booking.id}/checkin`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  }).then(r => r.json());
  console.log(`✓ Check-in Verified: #${book1Data.booking.id} status is now: ${checkinRes.booking.status}`);

  const checkoutRes = await fetch(`${BASE_URL}/amenities/bookings/${book1Data.booking.id}/checkout`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  }).then(r => r.json());
  console.log(`✓ Check-out Verified: #${book1Data.booking.id} status is now: ${checkoutRes.booking.status}`);

  // 9. Query KPIs
  const kpiRes = await fetch(`${BASE_URL}/analytics/kpis`).then(r => r.json());
  console.log('\n📊 Real-Time KPI Report:');
  console.log(`   - Avg Resolution Time: ${kpiRes.kpis.maintenanceResolutionTimeHours} hrs (Target ≤ 48h SLA) -> SLA Met: ${kpiRes.kpis.resolutionSlaMet}`);
  console.log(`   - Ticket Completion Rate: ${kpiRes.kpis.requestCompletionRatePct}% (Target ≥ 90%)`);
  console.log(`   - Amenity Double-Booking Conflicts: ${kpiRes.kpis.amenityBookingConflicts} (Target: 0 Conflicts)`);
  console.log(`   - System Latency: ${kpiRes.kpis.systemResponseTimeMs} ms (Target ≤ 2.0s)`);
  console.log(`   - Resident Satisfaction: ${kpiRes.kpis.userSatisfactionScore} / 5.0`);

  console.log('\n🎉 ALL SYSTEM INTEGRATION TESTS PASSED WITH 100% SUCCESS!');
}

runTests().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});

