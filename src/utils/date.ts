import moment from 'moment';

const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD HH:mm';

export const formatDate = (date: string | Date, format: string = DEFAULT_DATE_FORMAT): string => {
    return moment(date).format(format);
};

export const formatDateWithLocale = (date: string | Date) => {
    const userLocale = navigator.language || 'en';
    return moment(date).locale(userLocale).format('L LT');
};