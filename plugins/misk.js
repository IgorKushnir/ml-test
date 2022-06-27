export default defineNuxtPlugin(() => {

    return {
        provide: {
            getMonths: [
                ['February', 'Feb.'],
                ['March', 'Mar.'],
                ['April', 'Apr.'],
                ['May', 'May'],
                ['June', 'Jun.'],
                ['July', 'Jul.'],
                ['August', 'Aug.'],
                ['September', 'Sep..'],
                ['October', 'Oct.'],
                ['November', 'Nov.'],
                ['December ', 'Dec.'],
            ],
            getDatesInRange: (from, to, months, showYear) => {
                const _from = new Date(from);
                const _to = new Date(to);
                const compareDate = (_from.getMonth() + _from.getFullYear()) === (_to.getMonth() + _to.getFullYear())

                let _fromYear = '';
                let _toYear = '';
                if (showYear) {
                    _fromYear = ', ' + _from.getFullYear()
                    _toYear = ', ' + _to.getFullYear()
                }

                const mFrom = months[_from.getMonth() - 1][1]
                const mTo = months[_to.getMonth() - 1][1]
                if (compareDate) {
                    return mFrom + ' ' + _from.getDate() + '-' + _to.getDate() + _fromYear;
                }
                return mFrom + ' ' + _from.getDate() + _fromYear + ' - ' + mTo + ' ' +  _to.getDate() + _toYear;
            },
            getDate: (date, months) => {
                const _date = new Date(date);
                const m = months[_date.getMonth() - 1][0]

                return m + ' ' +  _date.getDate() + ', ' + _date.getFullYear()
            },

            handleNewLine: (string) => {
                return string.replace(/(?:\r\n|\r|\n)/g, '<br />');
            }
        }
    }
})
