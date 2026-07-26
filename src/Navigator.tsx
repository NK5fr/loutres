import { Routes, Route } from "react-router";
import Presentation from "./Presentation";
import Feeding from "./Feeding";

export default function Navigator() {
    return (
        <Routes>
            <Route path="/" element={<Presentation />} />
            <Route path="/feeding" element={<Feeding />} />
        </Routes>
    );
}