import {} from "../";
import app from "../api";

jest.mock("../api/routes/waifus.routes");

describe("Waifus routes", () => {
  describe("GET /api/waifus", () => {
    it("should return waifus", async () => {
      const response = await app.get("/api/waifus");
      expect(response.status).toBe(200);
    });
  });
});
