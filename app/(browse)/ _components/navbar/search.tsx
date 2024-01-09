"use client";

import qs from "query-string"
import { SearchIcon } from "lucide-react"
import { ChangeEvent, useState } from 'react'
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/ui/button"


export const Search = () => {

    const router = useRouter()
    const [value, setValue] = useState<string>()

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log('submit', value)

        if (!value) {
            return;
        }

        const url = qs.stringifyUrl(
            { url: '/',  query: {term: value} }, 
            { skipEmptyString: true }
        )

        router.push(url)
    }
    return <div>
        <form
            onSubmit={onSubmit}
            className="relative w-full lg:w-[400px] flex items-enter"
        >
            <Input
                value={value}
                onChange={(event) => setValue(event.target.value)}
                placeholder="Search"
                className="rounded-r-none focus-visible:ring-0 
                    focus-visible:ring-transparent 
                    focus-visible:ring-offset-0"
            />
            <Button
                type="submit"
                size="sm"
                variant="secondary"
                className="rounded-l-none"
            >
                <SearchIcon className="h-5 w-5 text-muted-foreground"/>
            </Button>
        </form>
    </div>
}