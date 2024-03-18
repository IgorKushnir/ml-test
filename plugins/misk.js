export default defineNuxtPlugin(() => {

    return {
        provide: {
            getMonths: [
                ['January', 'Jan.'],
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
                const compareDate = (_from.getUTCMonth() + _from.getUTCFullYear()) === (_to.getUTCMonth() + _to.getUTCFullYear())

                let _fromYear = '';
                let _toYear = '';
                if (showYear) {
                    _fromYear = ', ' + _from.getUTCFullYear()
                    _toYear = ', ' + _to.getUTCFullYear()
                }

                const mFrom = months[_from.getUTCMonth()][1]
                const mTo = months[_to.getUTCMonth()][1]
                if (compareDate) {
                    return mFrom + ' ' + _from.getUTCDate() + '-' + _to.getUTCDate() + _fromYear;
                }
                return mFrom + ' ' + _from.getUTCDate() + _fromYear + ' - ' + mTo + ' ' +  _to.getUTCDate() + _toYear;
            },
            getDate: (date, months) => {
                const _date = new Date(date);
                const m = months[_date.getUTCMonth()][0]

                return m + ' ' +  _date.getUTCDate() + ', ' + _date.getUTCFullYear()
            },

            handleNewLine: (string) => {
                return string?.replace(/(?:\r\n|\r|\n)/g, '<br />');
            },

            divideSubMenu: (subMenu) => {
                let splitIndexes = [];
                subMenu.forEach((e, index) => {
                    if (e.url === '#') {
                        splitIndexes.push(index - 1)
                    }
                })


                subMenu = subMenu.reduceRight((result, value, index) => {
                    result[0] = result[0] || [];

                    if (splitIndexes.includes(index)) {
                        result.unshift([value]);
                    } else {
                        result[0].unshift(value);
                    }

                    return result;
                }, []);

                subMenu.map(e => {
                    if (e[0].url === '#') {
                        return e.shift()
                    }
                    return e;
                })
                return subMenu;
            },

            validateEmail: (email) => {
                const re = /\S+@\S+\.\S+/;
                return re.test(email);
            },
            isUrl: (string) => {
                if (!(string.startsWith('http://') || string.startsWith('https://') || string.startsWith('www.'))) return false

                try {
                    if (!(string.startsWith('http://') || string.startsWith('https://'))) string = 'https://'+string
                    new URL(string);
                    return true;
                } catch (_) {
                    return false;
                }
            }
        }
    }
})
