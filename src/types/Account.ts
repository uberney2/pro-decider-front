export interface BuOwner {
    id: string;
    name: string;
    
  }
  
  export interface Portfolio {
    id: string;
    name: string;
  }
  
  export interface Account {
    id: string;
    name: string;
    buOwner: BuOwner;
    portfolio: Portfolio;
    status: string;
    keyPeople?: any[];  
    salesforceLink?: string;
    pcsLink?: string;
    strategy?: string;
    createdAt?: string;
    updatedAt?: string;
  }