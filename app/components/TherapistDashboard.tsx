'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';


    interface Patient {
        id: string;
        name: string;
        lastSession: string;
        nextAppointment: string;
        status: 'Active' | 'Inactive';
        mentalHealthMetrics: {
          anxiety: number[];
          stability: number[];
        };
        summaryText: string;
      }
      
      // Mock patient data - replace with your actual data source
      const initialPatients: Patient[] = [
        { 
          id: '1', 
          name: 'Emily Johnson', 
          lastSession: '2024-05-15', 
          nextAppointment: '2024-06-01',
          status: 'Active',
          mentalHealthMetrics: {
            anxiety: [3, 4, 2, 5, 3, 2],
            stability: [7, 6, 8, 5, 7, 6]
          },
          summaryText: "Emily has shown consistent progress in managing anxiety through cognitive behavioral techniques. Recent sessions focus on stress management and building resilience."
        },
        { 
          id: '2', 
          name: 'Michael Rodriguez', 
          lastSession: '2024-05-10', 
          nextAppointment: '2024-05-25',
          status: 'Active',
          mentalHealthMetrics: {
            anxiety: [7, 6, 6, 5, 3, 3],
            stability: [3, 2, 5, 5, 6, 8]
          },
          summaryText: "Michael is working through workplace-related stress and developing coping mechanisms. Progress has been steady with focus on mindfulness and emotional regulation."
        }
      ];
      
      const TherapistDashboard: React.FC = () => {
        const [patients, setPatients] = useState<Patient[]>(initialPatients);
        const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
      
        // Transform data for recharts
        const formatChartData = (patient: Patient) => {
          return patient.mentalHealthMetrics.anxiety.map((anxiety, index) => ({
            session: `Session ${index + 1}`,
            Anxiety: anxiety,
            Stability: patient.mentalHealthMetrics.stability[index]
          }));
        };
      
        return (
          <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Therapist Dashboard</h1>
            
            <div className="grid grid-cols-1 gap-4">
              {/* Patient List */}
              <Card>
                <CardHeader>
                  <CardTitle>My Patients</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {patients.map((patient) => (
                      <div 
                        key={patient.id} 
                        className={`
                          flex justify-between items-center p-3 border rounded-lg 
                          ${selectedPatient?.id === patient.id ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'}
                          ${patient.status === 'Inactive' ? 'opacity-60' : ''}
                        `}
                      >
                        <div>
                          <div className="font-semibold">{patient.name}</div>
                          <div className="text-sm text-gray-500">
                            Last Session: {patient.lastSession}
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedPatient(patient)}
                        >
                          View Details
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
      
              {/* Patient Summary Section */}
              {selectedPatient && (
                <Card>
                  <CardHeader>
                    <CardTitle>Patient Summary: {selectedPatient.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Text Summary */}
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Progress Summary</h3>
                        <p className="text-gray-700">{selectedPatient.summaryText}</p>
                        
                        <div className="mt-4">
                          <h4 className="font-medium">Key Observations:</h4>
                          <ul className="list-disc list-inside text-sm text-gray-600">
                            <li>Next Appointment: {selectedPatient.nextAppointment}</li>
                            <li>Current Status: {selectedPatient.status}</li>
                          </ul>
                        </div>
                      </div>
      
                      {/* Mental Health Metrics Graph */}
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Mental Health Metrics</h3>
                        <LineChart 
                          width={400} 
                          height={300} 
                          data={formatChartData(selectedPatient)}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="session" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="Anxiety" 
                            stroke="#8884d8" 
                            activeDot={{ r: 8 }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="Stability" 
                            stroke="#82ca9d" 
                          />
                        </LineChart>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        );
      };

      export default TherapistDashboard;