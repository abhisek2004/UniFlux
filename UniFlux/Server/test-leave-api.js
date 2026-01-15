#!/usr/bin/env node
/**
 * Automated Leave Management API Test Script
 * Tests all leave management endpoints
 */

const BASE_URL = 'http://localhost:5000';
let adminToken = '';
let hodToken = '';
let teacherToken = '';
let leaveId = '';
let policyId = '';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testEndpoint(name, method, url, token = null, body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${url}`, options);
    const data = await response.json();

    if (response.ok) {
      log(`✅ ${name}`, 'green');
      return { success: true, data };
    } else {
      log(`❌ ${name} - ${data.message || 'Failed'}`, 'red');
      return { success: false, error: data };
    }
  } catch (error) {
    log(`❌ ${name} - ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

async function runTests() {
  log('\n🚀 Starting Leave Management API Tests\n', 'blue');
  
  // Test 1: Health Check
  log('═══════════════════════════════════════', 'yellow');
  log('1. HEALTH CHECK', 'yellow');
  log('═══════════════════════════════════════', 'yellow');
  await testEndpoint('Server Health Check', 'GET', '/');

  // Test 2: Authentication
  log('\n═══════════════════════════════════════', 'yellow');
  log('2. AUTHENTICATION', 'yellow');
  log('═══════════════════════════════════════', 'yellow');
  
  const adminLogin = await testEndpoint(
    'Admin Login',
    'POST',
    '/api/auth/login',
    null,
    { email: 'admin@uniflux.edu', password: 'password123' }
  );
  if (adminLogin.success) {
    adminToken = adminLogin.data.token;
  }

  const hodLogin = await testEndpoint(
    'HOD Login',
    'POST',
    '/api/auth/login',
    null,
    { email: 'rajesh.kumar@uniflux.edu', password: 'password123' }
  );
  if (hodLogin.success) {
    hodToken = hodLogin.data.token;
  }

  const teacherLogin = await testEndpoint(
    'Teacher Login',
    'POST',
    '/api/auth/login',
    null,
    { email: 'rahul.mehra@uniflux.edu', password: 'password123' }
  );
  if (teacherLogin.success) {
    teacherToken = teacherLogin.data.token;
  }

  if (!adminToken || !hodToken || !teacherToken) {
    log('\n❌ Authentication failed. Cannot proceed with tests.', 'red');
    return;
  }

  // Test 3: Leave Policy Management
  log('\n═══════════════════════════════════════', 'yellow');
  log('3. LEAVE POLICY MANAGEMENT', 'yellow');
  log('═══════════════════════════════════════', 'yellow');

  const createPolicy = await testEndpoint(
    'Create Default Leave Policy',
    'POST',
    '/api/leave-policies/create-default',
    adminToken,
    {
      userType: 'teacher',
      department: 'CSE',
      academicYear: '2025-2026'
    }
  );
  if (createPolicy.success) {
    policyId = createPolicy.data.data._id;
  }

  await testEndpoint(
    'Get All Leave Policies',
    'GET',
    '/api/leave-policies',
    adminToken
  );

  await testEndpoint(
    'Get My Leave Policy',
    'GET',
    '/api/leave-policies/my-policy',
    teacherToken
  );

  if (policyId) {
    await testEndpoint(
      'Get Policy By ID',
      'GET',
      `/api/leave-policies/${policyId}`,
      adminToken
    );
  }

  // Test 4: Leave Balance Management
  log('\n═══════════════════════════════════════', 'yellow');
  log('4. LEAVE BALANCE MANAGEMENT', 'yellow');
  log('═══════════════════════════════════════', 'yellow');

  await testEndpoint(
    'Initialize Leave Balances',
    'POST',
    '/api/leave-balance/initialize',
    adminToken,
    {
      userType: 'teacher',
      department: 'CSE'
    }
  );

  await testEndpoint(
    'Get My Leave Balance',
    'GET',
    '/api/leave-balance/my-balance',
    teacherToken
  );

  await testEndpoint(
    'Get Balance Summary',
    'GET',
    '/api/leave-balance/summary',
    adminToken
  );

  await testEndpoint(
    'Get Low Balance Users',
    'GET',
    '/api/leave-balance/low-balance?threshold=5',
    adminToken
  );

  // Test 5: Leave Application Management
  log('\n═══════════════════════════════════════', 'yellow');
  log('5. LEAVE APPLICATION MANAGEMENT', 'yellow');
  log('═══════════════════════════════════════', 'yellow');

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

  const applyLeave = await testEndpoint(
    'Apply for Leave (Teacher)',
    'POST',
    '/api/leaves',
    teacherToken,
    {
      leaveType: 'casual',
      startDate: tomorrow.toISOString().split('T')[0],
      endDate: dayAfterTomorrow.toISOString().split('T')[0],
      reason: 'Personal work - automated test'
    }
  );
  if (applyLeave.success) {
    leaveId = applyLeave.data.data._id;
  }

  await testEndpoint(
    'Get My Leaves',
    'GET',
    '/api/leaves/my-leaves',
    teacherToken
  );

  await testEndpoint(
    'Get All Leaves (Admin)',
    'GET',
    '/api/leaves?page=1&limit=10',
    adminToken
  );

  await testEndpoint(
    'Get Pending Leaves (HOD)',
    'GET',
    '/api/leaves/pending',
    hodToken
  );

  if (leaveId) {
    await testEndpoint(
      'Get Leave By ID',
      'GET',
      `/api/leaves/${leaveId}`,
      teacherToken
    );

    await testEndpoint(
      'Get Leave Balance',
      'GET',
      '/api/leaves/balance',
      teacherToken
    );

    await testEndpoint(
      'Get Leave Statistics',
      'GET',
      '/api/leaves/statistics',
      hodToken
    );

    await testEndpoint(
      'Approve Leave (HOD)',
      'PUT',
      `/api/leaves/${leaveId}/approve`,
      hodToken,
      { approverComments: 'Approved - automated test' }
    );

    await testEndpoint(
      'Cancel Leave',
      'DELETE',
      `/api/leaves/${leaveId}`,
      teacherToken
    );
  }

  // Test 6: Department-specific Queries
  log('\n═══════════════════════════════════════', 'yellow');
  log('6. DEPARTMENT QUERIES', 'yellow');
  log('═══════════════════════════════════════', 'yellow');

  await testEndpoint(
    'Get Department Leaves',
    'GET',
    '/api/leaves/department/CSE?page=1&limit=10',
    hodToken
  );

  await testEndpoint(
    'Get Department Balances',
    'GET',
    '/api/leave-balance/department/CSE',
    hodToken
  );

  // Summary
  log('\n═══════════════════════════════════════', 'yellow');
  log('TEST SUMMARY', 'yellow');
  log('═══════════════════════════════════════', 'yellow');
  log('✅ Leave Management API tests completed!', 'green');
  log('📋 Check the output above for any failures', 'blue');
  log('', 'reset');
}

// Run tests
runTests().catch(error => {
  log(`\n❌ Test suite failed: ${error.message}`, 'red');
  process.exit(1);
});
