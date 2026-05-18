import 'dotenv/config'
import { TwitterApi } from "twitter-api-v2"

const twitterClient = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})
console.log(process.env.TWITTER_API_KEY)
console.log(process.env.TWITTER_API_SECRET)
console.log(process.env.TWITTER_ACCESS_TOKEN)
console.log(process.env.TWITTER_ACCESS_TOKEN_SECRET)
export async function createPost(status) {
    try {
        console.log(`Posting on X : ${status}`)

        return { // mock/simulated response 
            content: [
                {
                    type: "text",
                    text: `Tweet posted successfully : ${status}`
                }
            ]
        }
    }
    catch (error) {

        console.log(error)
        console.log("FULL ERROR:", error)

        console.log("ERROR DATA:", error.data)

        console.log("ERROR CODE:", error.code)

        console.log("ERROR MESSAGE:", error.message)

        return {
            content: [
                {
                    type: "text",
                    text: `${error.message}`
                }
            ]
        }
    }

}