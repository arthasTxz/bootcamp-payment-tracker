"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckIcon } from "lucide-react"


interface ModuleData {
  name: number,
  payment: number,
  completed: boolean;
}

interface AttendanceData {
  [date: string]: boolean;
}

const MONTHS = ['Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre'];
const START_DATE = new Date(2024, 6, 17); // 17 de julio de 2023
const END_DATE = new Date(2024, 10, 14); // 13 de noviembre de 2023

const payModule: ModuleData[] = [
  {
    name: 1,
    payment:3600,
    completed: false}, 
  {name: 2,
  payment:14400,
  completed: false
  }, 
  {name: 3,
    payment: 11200,
    completed: false
  },
  {name: 4,
    payment:28800,
    completed: false
  } , 
  {name: 5,
    payment: 12800,
    completed: false
  },
  {name: 6,
    payment: 18000,
    completed: false
  } , 
  {name: 7,
    payment:3600,
    completed: false
  }, 
  {name: 8,
    payment:3600,
    completed: false
  }]

export default function Component() {
  const [moduleData, setModuleData] = useState<ModuleData[]>(payModule);
  const [attendanceData, setAttendanceData] = useState<AttendanceData>({});
  const [paymentRates, setPaymentRates] = useState({ attendance: 2800, module: 0 });

  useEffect(() => {
    const savedData = localStorage.getItem('bootcampData');
    if (savedData) {
      const { moduleData, attendanceData, paymentRates } = JSON.parse(savedData);
      setModuleData(moduleData);
      setAttendanceData(attendanceData);
      setPaymentRates(paymentRates);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('bootcampData', JSON.stringify({ moduleData, attendanceData, paymentRates }));
  }, [moduleData, attendanceData, paymentRates]);

  const handleModuleChange = (index: number) => {
    const newData = [...moduleData];
    newData[index] = {
      ...newData[index], 
      completed: !newData[index].completed };
    setModuleData(newData);
  };

  const handleAttendanceChange = (date: string) => {
    setAttendanceData(prev => ({
      ...prev,
      [date]: !prev[date]
    }));
  };

  const markPastDaysAsAttended = () => {
    const today = new Date();
    const newAttendanceData = { ...attendanceData };
    generateDateRange().forEach(date => {
      if (date < today && date.getDay() !== 0 && date.getDay() !== 6) {
        newAttendanceData[date.toISOString()] = true;
      }
    });
    setAttendanceData(newAttendanceData);
  };

  // const generateMonthDays = (year: number, month: number) => {
  //   const date = new Date(year, month, 1);
  //   const days = [];
  //   while (date.getMonth() === month) {
  //     days.push(new Date(date));
  //     date.setDate(date.getDate() + 1);
  //   }
  //   return days;
  // };



  const generateDateRange = () => {
    const dates = [];
    for (let d = new Date(START_DATE); d <= END_DATE; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }
    return dates;
  };

  const calculateTotalPayment = () => {
    const attendancePayment = Object.values(attendanceData).filter(Boolean).length * paymentRates.attendance;
    // const modulePayment = moduleData.filter(m => m.completed).length * paymentRates.module;
    const modulePayment = moduleData.reduce((total, modulo) => {
      if (modulo.completed){
        return total + modulo.payment
      }
      else{
        return total
      }
    }, 0)
    return attendancePayment + modulePayment;
  };

  const esDiaPasado = (date: Date) => {
    return date < new Date();
};

  const dateRange = generateDateRange();
  const totalAttendanceDays = Object.values(attendanceData).filter(Boolean).length;
  const totalCompletedModules = moduleData.filter(m => m.completed).length;

  return (
    
    
    <Card className="w-full max-w-4xl mx-auto">
      
      <CardHeader>
        <CardTitle>Registro de Bootcamp (Julio - Noviembre 2024)</CardTitle>
      </CardHeader>
      <CardContent>

        
        <div className="space-y-6">
          <div className="flex space-x-4">
           
          </div>
          
         

        <div>
            <h3 className="text-lg font-semibold mb-2">Registro de Asistencia</h3>
            <Button 
              onClick={markPastDaysAsAttended}
              className="mb-4"
            >
              
              Marcar días pasados como asistidos
            </Button>
            {MONTHS.map((month, monthIndex) => {
                const monthDates = dateRange.filter(d => d.getMonth() === monthIndex + 6);
                if (monthDates.length === 0) return null;
                return (
                    <div key={month} className="mb-4">
                        <h4 className="font-medium mb-2">{month}</h4>
                        <div className="grid grid-cols-7 gap-2">
                            {monthDates.map((date, index) => {
                                const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                                const isOutOfRange = date < START_DATE || date > END_DATE;
                                return (
                                    <Button
                                        key={index}
                                        variant={attendanceData[date.toISOString()] ? "default" : "outline"}
                                        onClick={() => !isWeekend && !isOutOfRange && handleAttendanceChange(date.toISOString())}
                                        className={`h-10 w-10 p-0 ${(isWeekend || isOutOfRange) ? 'opacity-50 cursor-not-allowed' : ''} ${esDiaPasado(date) && !attendanceData[date.toISOString()] ? 'bg-red-200' : ''}`}
                                        disabled={isWeekend || isOutOfRange}
                                    >
                                        {date.getDate()}
                                        {attendanceData[date.toISOString()] && <CheckIcon className="h-3 w-3 absolute top-0 right-0" />}
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
            <h4 className="font-medium mt-4">Total Pagado: {calculateTotalPayment()} pesos</h4>
        </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Módulos Completados</h3>
            <div className="grid grid-cols-4 gap-2">
            
              {moduleData.map((module, index) => (
                <Button
                  key={index}
                  variant={module.completed ? "default" : "outline"}
                  onClick={() => handleModuleChange(index)}
                  className="relative"
                >
                  Módulo {index + 1}
                  {module.completed && <CheckIcon className="h-3 w-3 absolute top-0 right-0" />}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold">Resumen de Progreso y Pagos</h3>
            <div className="space-y-2">
              <div>
                <Label>Asistencia</Label>
                <Progress value={(totalAttendanceDays / 120) * 100} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  {totalAttendanceDays} de 120 días ({((totalAttendanceDays / 120) * 100).toFixed(1)}%)
                </p>
              </div>
              <div>
                <Label>Módulos Completados</Label>
                <Progress value={(totalCompletedModules / 8) * 100} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  {totalCompletedModules} de 8 módulos ({((totalCompletedModules / 8) * 100).toFixed(1)}%)
                </p>
              </div>
            </div>
            <div className="mt-4">
              <p>Total de Días Asistidos: {totalAttendanceDays}</p>
              <p>Total de Módulos Completados: {totalCompletedModules}</p>
              <p className="text-xl font-bold mt-2">Pago Total: ${calculateTotalPayment()}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
   
  )
}