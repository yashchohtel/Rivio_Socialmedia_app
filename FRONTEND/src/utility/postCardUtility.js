// functin to calclate the time when the post is uploaded used in postCard component
export const timeAgo = (date) => {

    // current date
    const now = new Date();

    // date of post creation
    const past = new Date(date);

    // calculation the difference of seconds
    const seconds = Math.floor((now - past) / 1000);

    // if second less then 60 (less then a minute) return ans in seconds
    if (seconds < 60) return `${seconds}s`;

    // if secnod less then 3600 (less then a hour) return ans in minute
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;

    // if second is less than 86400 (less than a day) return ans in hours
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;

    // if second is less than 604800 (less than a week) return ans in days
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;

    // is seoncd is greater then equal to 1 week or less then 12 week then return in week
    if (seconds >= 604800 && seconds < 604800 * 5) {
        return `${Math.floor(seconds / 604800)}w`;
    }

    // return the original date
    return past.toLocaleDateString(); 
};

