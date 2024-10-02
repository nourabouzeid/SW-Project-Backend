/**
 * This is a service for making a request to get user data of google account based on specified scopes using google token
 */

const getUserData = async (token: string): Promise<Record<string, any> | undefined> => {
    try {
        const response: Response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
        const data: Record<string, any> = await response.json();
        return data;
    } catch (err: any) {
        console.log(err.message);
        return undefined;
    }
}

export default getUserData;