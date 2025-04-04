// src/types/DetailsData.ts
export interface DetailsData {
    // Datos generales del pursuit
    pursuitName: string;
    gmPercentage: string;
    totalSOW: string;
  
    // Datos de BU y cuenta
    primarySalesBU: string;
    accountId: string;
    accountName: string;
    buOwnerId: string;
    buOwnerName: string;
    contractType: string;
    usaPointOfContact: string;
  
    // Fechas y otros datos
    pursuitStartDate: string;
    pursuitEndDate: string;
    additionalBackground: string;
    onboardingProcess: string;
    servicesScope: string;
    levelOfAccount: string;
    fullTimeEmployees: string;
    averageBillingRate: string;
    totalHours: string;
  
    // Responsables (almacenado como string, por ejemplo: "contact1, contact2")
    responsibleFromLatam: string;
  
    // Datos internos (usados en el formulario)
    pursuitKind: string; // "pursuit" o "project"
    status: string; // Por ejemplo: "Open", "Preanalysis", etc.
  }
  