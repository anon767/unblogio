import TimeAgo from 'javascript-time-ago';
import moment from 'moment';
import en from 'javascript-time-ago/locale/en';

export default class DateService {

    public static getRelativeTime(date: Date): string {
        TimeAgo.addLocale(en);
        const timeAgo = new TimeAgo('en-US');
        return timeAgo.format(date);
    }

    public static pgresToJS(date: string): Date {
        return moment(date).toDate();
    }
}

