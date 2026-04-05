import { badges, count } from '../../data/badges-manifest';

export default defineEventHandler(() => {
    return {
        success: true,
        badges,
        count,
    };
});
