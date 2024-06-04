// Example Controller Function for Intentional Error
const triggerError = (req, res, next) => {
    // Trigger an intentional error
    next({ status: 500, message: "Intentional Error" });
  };
  