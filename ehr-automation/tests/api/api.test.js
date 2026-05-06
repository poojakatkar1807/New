const { test, expect } = require('@playwright/test');
const { generateRandomPhone, generatePatientName, getFutureDate } = require('../../utils/helpers');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('API Tests — EHR Backend', () => {

  // --- Patient API ---

  test('@smoke TC-API-001 | GET /api/patients returns all patients', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/patients`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data.length).toBeGreaterThanOrEqual(3);
  });

  test('@smoke TC-API-002 | GET /api/patients/:id returns single patient', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/patients/P-1001`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data.firstName).toBe('Rajesh');
    expect(body.data.lastName).toBe('Kumar');
  });

  test('@regression TC-API-003 | GET /api/patients/:id returns 404 for invalid ID', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/patients/P-9999`);
    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body.success).toBe(false);
  });

  test('@smoke TC-API-004 | POST /api/patients creates a new patient', async ({ request }) => {
    const name = generatePatientName();
    const response = await request.post(`${BASE_URL}/api/patients`, {
      data: {
        firstName: name.firstName,
        lastName: name.lastName,
        age: 35,
        gender: 'Male',
        phone: generateRandomPhone()
      }
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data.id).toMatch(/^P-/);
    expect(body.data.firstName).toBe(name.firstName);
  });

  test('@regression TC-API-005 | POST /api/patients returns 400 for missing fields', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/patients`, {
      data: { firstName: 'Test' }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
  });

  test('@regression TC-API-006 | DELETE /api/patients/:id deletes a patient', async ({ request }) => {
    // First create a patient to delete
    const createRes = await request.post(`${BASE_URL}/api/patients`, {
      data: { firstName: 'ToDelete', lastName: 'User', gender: 'Male', phone: generateRandomPhone() }
    });
    const created = await createRes.json();
    const patientId = created.data.id;

    // Delete
    const deleteRes = await request.delete(`${BASE_URL}/api/patients/${patientId}`);
    expect(deleteRes.status()).toBe(200);

    // Verify deleted
    const getRes = await request.get(`${BASE_URL}/api/patients/${patientId}`);
    expect(getRes.status()).toBe(404);
  });

  // --- Appointments API ---

  test('@smoke TC-API-007 | GET /api/appointments returns all appointments', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/appointments`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data.length).toBeGreaterThanOrEqual(1);
  });

  test('@smoke TC-API-008 | POST /api/appointments creates new appointment', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/appointments`, {
      data: {
        patientId: 'P-1001',
        date: getFutureDate(10),
        time: '11:00',
        type: 'Follow-up',
        doctor: 'Dr. Sarah Johnson',
        notes: 'API created appointment'
      }
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data.patientName).toContain('Rajesh');
  });

  test('@regression TC-API-009 | POST /api/appointments returns 400 for missing fields', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/appointments`, {
      data: { patientId: 'P-1001' }
    });
    expect(response.status()).toBe(400);
  });

  // --- Vitals API ---

  test('@smoke TC-API-010 | GET /api/vitals/:patientId returns vitals', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/vitals/P-1001`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data.length).toBeGreaterThanOrEqual(1);
  });

  test('@smoke TC-API-011 | POST /api/vitals records new vitals', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/vitals`, {
      data: {
        patientId: 'P-1002',
        bp: '118/76',
        heartRate: 70,
        temp: 98.4,
        weight: 58,
        spo2: 99,
        notes: 'API recorded vitals'
      }
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data.bp).toBe('118/76');
  });
});
