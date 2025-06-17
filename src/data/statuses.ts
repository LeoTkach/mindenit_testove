interface NameValue {
    name: string;
    value: string;
  }
  
  const statuses: NameValue[] = [
    {
      "name": "All statuses",
      "value": "ALL"
    },
    {
      "name": "Active",
      "value": "ACTIVE"
    },
    {
      "name": "Disabled",
      "value": "DISABLED"
    }
  ]
  ;
  
  export default statuses;