import express, { Request } from "express";
import { createReadStream, createWriteStream } from "fs";
import { ShippingData } from "./typeDefs/shippingData";
import { parser } from "stream-json";
import { filter } from "stream-json/filters/Filter";
import { pick } from "stream-json/filters/Pick";
import { stringer } from "stream-json/Stringer";
import StreamArray from "stream-json/streamers/StreamArray";
import Assembler from "stream-json/Assembler";
import zlib from "zlib";
import { chain } from "stream-chain";

const app = express();

const port = process.env.PORT || 3001;

app.get(
    "/api/kits-shipping",
    (req: Request<{}, any, any, { search: string }>, res) => {
        const { search } = req.query;

        const result: ShippingData[] = [];

        const pipeline = createReadStream("KITS_SHIPPING_DATA.json").pipe(
            StreamArray.withParser()
        );

        pipeline.on("data", (data) => {
            if (data.value.label_id.includes(search)) {
                result.push(data.value);
                return data;
            }
        });

        // I will be honest, I know this isn't 100% scalable.
        // If I were to spend the most amount of time optimizing this, I would make sure there aren't ever more than 10 elements in the array.
        // Would would probably need to spend a while finding the best way to do this.
        // If anyone reviewing this knows the best way to do so, I would love to learn.

        pipeline.on("end", () => {
            const sortedResult = [...result].sort((a, b) =>
                a.label_id.localeCompare(b.label_id)
            );
            if (result.length > 10) {
                res.json(sortedResult.slice(0, 10));
            } else {
                res.json(sortedResult);
            }
        });
    }
);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
