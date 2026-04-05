import { deleteUser } from "../../utils/composables";

export default defineEventHandler(async (event) =>
{
    
    try
    {
        // Clear server-side session
        await deleteUser(event);
        
        
        // Return 200 with success message
        setResponseStatus(event, 200);
        return { success: true, message: "Logged out successfully" };
    }
    catch (error)
    {
        
        // Even if clearing fails, return success since the intent is to log out
        // The frontend will clear local state regardless
        setResponseStatus(event, 200);
        return { success: true, message: "Logged out successfully" };
    }
});