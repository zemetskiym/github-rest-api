import styles from "../styles/components/Overview.module.css"
import { useState, useEffect } from "react"
import { marked } from 'marked';
import Link from "next/link";

interface User {
    login: string,
    id: number,
    node_id: string,
    avatar_url: string,
    gravatar_id: boolean | string,
    url: string,
    html_url: string,
    followers_url: string,
    following_url: string,
    gists_url: string,
    starred_url: string,
    subscriptions_url: string,
    organizations_url: string,
    repos_url: string,
    events_url: string,
    received_events_url: string,
    type: string,
    site_admin: boolean,
    name: string | null,
    company: string | null,
    location: string | null,
    email: string | null,
    hireable: boolean,
    bio: string | null,
    twitter_username: string | null,
    public_repos: number | false,
    public_gists: number | false,
    followers: number | false,
    following: number | false,
    created_at: string,
    updated_at: string
}

export default function Overview (userData: Partial<User>): JSX.Element {
    const [readme, setReadme] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);
    interface Readme {content: string}

    useEffect(() => {
        async function fetchData () {
            setLoading(true)
            try {
                let readmeResponse: Response = await fetch(`https://api.github.com/repos/${userData.login}/${userData.login}/readme`)
                let readmeData: Readme = await readmeResponse.json()
                setReadme(marked.parse(Buffer.from(readmeData.content, "base64").toString()))
                setLoading(false) 
            } catch(error) {
                setError(true)
                return
            }
            setLoading(false)
        }
        fetchData()
    }, [userData])
    
    if (error) return (
        <div id={styles.error}>This user has no profile readme. For more information, visit the documentation 
            <Link id={styles.documentation} target="_blank" href="https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/managing-your-profile-readme">here</Link>.
        </div>
    )

    if (loading) return (<div id={styles.loading}>Loading...</div>)

    return (
        <div id={styles.readmeContainer}>
            <small id={styles.title}>{userData.login} <span style={{color: "#727a83"}}>/</span> README<span style={{color: "#727a83"}}>.md</span></small>
            <div dangerouslySetInnerHTML={{__html: readme}} />
        </div>
    )
}