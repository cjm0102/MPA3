
        document.addEventListener("DOMContentLoaded", function() {
            const greeting = document.getElementById("greeting");
            const nameInput = document.getElementById("name");
            const bmiForm = document.getElementById("bmiForm");
            const displayButton = document.getElementById("displayData");
            const clearButton = document.getElementById("clearData");
            const currentRecordBody = document.getElementById("currentRecord");
            const previousRecordsBody = document.getElementById("previousRecords");

            function getStoredName() {
                return localStorage.getItem("userName");
            }

            function setStoredName(name) {
                localStorage.setItem("userName", name);
            }

            function getStoredFirstName() {
                return localStorage.getItem("firstUserName");
            }

            function setStoredFirstName(name) {
                localStorage.setItem("firstUserName", name);
            }

            function getBMIRecords() {
                return JSON.parse(localStorage.getItem("bmiRecords")) || [];
            }

            function setBMIRecords(records) {
                localStorage.setItem("bmiRecords", JSON.stringify(records));
            }

            function displayGreeting() {
                const storedFirstName = getStoredFirstName();
                if (storedFirstName) {
                    greeting.textContent = `Hello, ${storedFirstName}`;
                }
            }

            function displayCurrentRecord(record) {
                currentRecordBody.innerHTML = `
                    <tr>
                        <td>${record.date}</td>
                        <td>${record.name}</td>
                        <td>${record.weight}</td>
                        <td>${record.height}</td>
                        <td>${record.bmi}</td>
                        <td>${record.status}</td>
                    </tr>
                `;
            }

            function displayPreviousRecords() {
                const records = getBMIRecords();
                previousRecordsBody.innerHTML = "";
                // Skip the latest record
                for (let i = records.length - 2; i >= 0; i--) {
                    const record = records[i];
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${record.date}</td>
                        <td>${record.name}</td>
                        <td>${record.weight}</td>
                        <td>${record.height}</td>
                        <td>${record.bmi}</td>
                        <td>${record.status}</td>
                    `;
                    previousRecordsBody.appendChild(row);
                }
                previousRecordsBody.style.display = 'table-row-group';
            }

            function calculateBMI(weight, height) {
                return (weight / (height * height)).toFixed(1);
            }

            function getBMIStatus(bmi) {
                if (bmi < 18.5) return "Underweight";
                if (bmi < 24.9) return "Normal weight";
                if (bmi < 29.9) return "Overweight";
                return "Obesity";
            }

            bmiForm.addEventListener("submit", function(event) {
                event.preventDefault();

                const name = nameInput.value.trim();
                const weight = parseFloat(document.getElementById("weight").value);
                const height = parseFloat(document.getElementById("height").value);

                if (!name || isNaN(weight) || isNaN(height)) {
                    alert("Please fill out all fields correctly.");
                    return;
                }

                if (!getStoredFirstName()) {
                    setStoredFirstName(name);
                }
                setStoredName(name);
                displayGreeting();

                const bmi = calculateBMI(weight, height);
                const status = getBMIStatus(bmi);
                const date = new Date().toLocaleString();

                const newRecord = { date, name, weight, height, bmi, status };
                const records = getBMIRecords();
                records.push(newRecord);
                setBMIRecords(records);

                displayCurrentRecord(newRecord);

                bmiForm.reset();
            });

            displayButton.addEventListener("click", function() {
                displayPreviousRecords();
            });

            clearButton.addEventListener("click", function() {
                localStorage.removeItem("bmiRecords");
                localStorage.removeItem("firstUserName");
                localStorage.removeItem("userName");
                previousRecordsBody.innerHTML = "";
                previousRecordsBody.style.display = 'none';
                currentRecordBody.innerHTML = "";
                greeting.textContent = "Hello";
            });

            displayGreeting();
        })