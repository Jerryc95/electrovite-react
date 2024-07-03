import React from "react";
import {render, screen } from "@testing-library/react"

import SignInPage from "../renderer/pages/auth/SignIn";

describe("Flowplanr", () => {
    test("Test app render", () => {
        render(<SignInPage />)
        const text = screen.getByText("Projects")
        expect(text).toBeInTheDocument()
    })
})