export const generateBody = (userData: {[key: string]: {value: string | string[]}}, language: string) => {
    const parsedBudget = typeof userData.budget.value === 'string' ? parseInt(userData.budget.value) : 0
    const timeToWedding = typeof userData.weddingDate.value === 'string' ? new Date(userData.weddingDate.value).getTime() -  Date.now() : 0
    let priorityCount = 0

    switch (parsedBudget) {
        case 6:
            priorityCount = priorityCount + 1
            break;
        case 12:
            priorityCount = priorityCount + 2
            break;
        case 28:
            priorityCount = priorityCount + 3
            break;
        default:
            break;
    }
    console.log('priorityCount budget', priorityCount)
console.log('timeToWedding', timeToWedding)
    if (timeToWedding < 1000 * 60 * 60 * 24 * 30) {
        priorityCount = priorityCount + 3
    } else if (timeToWedding < 1000 * 60 * 60 * 24 * 30 * 6) {
        priorityCount = priorityCount + 2
    } else {
        priorityCount = priorityCount + 1
    }

    const priority = priorityCount > 4 ? 'Wysoki' : priorityCount > 2 ? 'Średni' : 'Niski'

    return [
    'Nowe zgłoszenie', //status
    '', //postponed
    priority, //priority
    `${new Date(Date.now()).toLocaleDateString('pl-PL')}, ${new Date(Date.now()).toLocaleTimeString('pl-PL')}`, //creation date
    userData.lastName.value, // last name
    userData.firstName.value, // first name
    userData.email.value, // email
    userData.phone.value, // Telefon
    userData.weddingDate.value, // Data ślubu
    userData.budget.value, // Budżet (PLN)
    userData.fittingType.value, // Typ przymiarki
    userData.models.value, // Modele sukni
    userData.dressSize.value, // Rozmiar
    userData.preferredContact.value, // Kontakt
    userData.people.value, // Towarzyszące osoby
    language, // Język
    '', // Ostatni kontakt
    '', //urgent
    '', // Ponowny kontakt
    userData.instagram.value, // Instagram
    userData.findOut.value?.join(", "),  // Źródło MillaNova
     '',  // Menedżer
]}