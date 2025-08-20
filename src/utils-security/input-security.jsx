const inputSanitizer = (input) => {
  if (typeof input !== "string") {
    return input;
  }
  // create a temporary "div" container to strip HTML tags
  const temp = document.createElement("div");
  temp.innerHTML = input; // This put the user "input" containing tags into the "div" container

  // Remove the tag from the user input by grabbing only the text or empty string if there is none.
  const stripped = temp.textContent || temp.innerText || "";

  // Encode any inner special characters with html encoding after the outside tags has been removed.
  return stripped
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")   // .replace(/'/g, "&#x27;")   // names like O'Shea becomes invalid
    .replace(/\\/g, "&#x5C;") // The symbol "\\" is an escaped backslash
    .replace(/\//g, "&#x2F;"); // The symbol "\/" is an escaped forward slash
};

const validateInput = {
  username: (username) => {
    // returns "true" if the following are true
    return username && username.trim().length >= 3 && username.length <= 40;
  },
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email); // returns "true" if there is email match
  },
  password: (password) => {
    const passwordRegex = /^(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@$#!%*?&]{6,}$/;
    return passwordRegex.test(password); // returns "true" if there is password match
  },
  confirm_password: (confirm_password) => {
    const passwordRegex = /^(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@$#!%*?&]{6,}$/;
    return passwordRegex.test(confirm_password); // returns "true" if there is confirm_password match
  },
};

export { inputSanitizer, validateInput };
