import httpStatus from "http-status";
import app from "../src/app";
import supertest from "supertest";

const api = supertest(app);

describe("POST method tests", () => {
    it("should return 201 when inserting a fruit", async () => {
        const body ={
            name: 'Pineapple',
            price: 10000
        }
        const result = await api.post("/fruits").send(body);
        const status = result.status;

        expect(status).toBe(httpStatus.CREATED);
        
    });
    it("should return 409 when inserting a fruit that is already registered", async () => {
        const body ={
            name: 'Pineapple',
            price: 10000
        }
        const result = await api.post("/fruits").send(body);
        const status = result.status;

        expect(status).toBe(httpStatus.CONFLICT);
    });
    it("should return 422 when inserting a fruit with data missing", async () => {
        const body = {
            name: '',
            price: null
        };
        const result = await api.post("/fruits").send(body);
        const status = result.status;

        expect(status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });
});

describe("GET method tests", () => {
    it("should return 404 when trying to get a fruit that doesn't exists", async() => {
        const result = await api.get("/fruits/999999999");
        const status = result.status;

        expect(status).toBe(httpStatus.NOT_FOUND);
    });
    it("should return 400 when id param is not valid", async() => {
        const result = await api.get("/fruits/batatinha");
        const status = result.status;

        expect(status).toBe(httpStatus.BAD_REQUEST);
    });
    it("should return a fruit given an id", async() => {
        const result = await api.get("/fruits/1");
        const body = result.body

        expect(body).toEqual({
            id: expect.any(Number),
            name: expect.any(String),
            price: expect.any(Number)
        });
    });
    it("should return all fruits", async() => {
        const result = await api.get("/fruits");
        const body = result.body;

        expect(body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                    price: expect.any(Number)
                })
            ])
        );
    });
});