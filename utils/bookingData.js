export const bookingScenarios = Array.from({ length: 40 }, (_, index) => ({
    id: index + 1,
    qaseId: 200 + index,
    name: `TestUser ${index + 1}`,
    email: `testuser${index + 1}@valtive.io`
}));