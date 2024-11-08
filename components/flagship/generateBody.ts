export const generateBody = (userData: {[key: string]: {value: string}}, dressType: string, language: string) => [
    'Nowe zgłoszenie', //status
    '', //postponed
     userData.urgent.value, //urgent
     '', //priority
     `${new Date(Date.now()).toLocaleDateString('pl-PL')}, ${new Date(Date.now()).toLocaleTimeString('pl-PL')}`, //creation date
     dressType, // dress type
     userData.firstName.value, // first name
     userData.lastName.value, // last name
     userData.email.value, // email
     userData.phone.value, // Telefon
     userData.weddingDate.value, // Data ślubu
     userData.fittingType.value, // Typ przymiarki
     '',  // Menedżer
     userData.dressSize.value, // Rozmiar
     userData.budget.value, // Budżet (USD)
     userData.models.value, // Modele sukni
     userData.instagram.value, // Instagram
     userData.findOut.value,  // Źródło MillaNova
     userData.preferredContact.value, // Kontakt
     '', // Ostatni kontakt
     '', // Ponowny kontakt
     language, // Język
     userData.people.value, // Towarzyszące osoby
]