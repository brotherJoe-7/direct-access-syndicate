export const mockStats = {
  annualRevenue: 45000000,
  totalIncome: 125000000,
  totalExpenses: 82000000,
  totalSavings: 43000000,
  monthlyRevenue: [
    { name: 'Jan', value: 3500000 },
    { name: 'Feb', value: 4200000 },
    { name: 'Mar', value: 5100000 },
    { name: 'Apr', value: 4800000 },
    { name: 'May', value: 6200000 },
    { name: 'Jun', value: 7500000 }
  ],
  monthlyByLevel: [
    { level: 'Primary 1', total: 12500000 },
    { level: 'Primary 2', total: 10200000 },
    { level: 'Primary 3', total: 15800000 },
    { level: 'Primary 4', total: 11400000 },
    { level: 'Primary 5', total: 18900000 },
    { level: 'Primary 6', total: 20500000 }
  ],
  activityLogs: [
    { action: 'payment_received', details: 'FEE Receipt #8829 issued for Mariama Kamara', timestamp: new Date().toISOString() },
    { action: 'attendance_marked', details: 'Class 6 attendance synchronized (98% present)', timestamp: new Date(Date.now() - 3600000).toISOString() },
    { action: 'report_uploaded', details: 'Mid-term feedback published for 24 students', timestamp: new Date(Date.now() - 7200000).toISOString() },
    { action: 'inventory_update', details: 'Textbook distribution logged for Term 2', timestamp: new Date(Date.now() - 86400000).toISOString() }
  ]
};

export const mockParentProfile = {
  parent_name: 'Demo Parent',
  email: 'parent@demo.com',
  phone: '077000000',
  profile_img: null
};

export const mockChildren = [
  { id: 'child-1', student_name: 'Alhaji Nimneh', level: 'Primary 6', reg_code: 'DAS-2024-001' },
  { id: 'child-2', student_name: 'Fanta Nimneh', level: 'Primary 4', reg_code: 'DAS-2024-042' }
];

export const mockTeacherData = {
    name: 'Demo Teacher',
    username: 'teacher_demo',
    subjects: ['Mathematics', 'Science'],
    assignedClass: 'Primary 6'
};
