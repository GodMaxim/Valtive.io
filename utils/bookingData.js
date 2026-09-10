export const bookingScenarios = Array.from({ length: 5 }, (_, index) => ({
    id: index + 1,
    qaseId: 200 + index,
    name: `TestUser ${index + 1}`,
    email: `testuser${index + 1}@valtive.io`
}));