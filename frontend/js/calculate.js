document.getElementById('freightForm').addEventListener('submit', function(event) {
    // Prevent the form from submitting the traditional way
    event.preventDefault();

    // Get form data
    const weight = document.getElementById('weight').value;
    const distance = document.getElementById('distance').value;
    const goodsType = document.getElementById('goodsType').value;
    const pickupLocation = document.getElementById('pickupLocation').value;
    const deliveryLocation = document.getElementById('deliveryLocation').value;

    // For now, let's just log the data to the console
    console.log({
        weight,
        distance,
        goodsType,
        pickupLocation,
        deliveryLocation
    });

    // Create an XMLHttpRequest object
    const xhr = new XMLHttpRequest();

    // Configure the request
    xhr.open('POST', 'http://localhost:3000/api/calculateFreight', true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

    // Handle the response
    xhr.onload = function() {
        const response = JSON.parse(xhr.responseText);
        
        if (response.success) {
            const formattedCost = parseFloat(response.freightCost).toFixed(2); // Round to 2 decimal places
            window.location.href = `results.html?freightCost=${formattedCost}`;
        } else {
            alert('Error calculating freight cost. Please try again.');
        }
    };

    // Handle errors
    xhr.onerror = function() {
        console.error('Request failed:', xhr.responseText);
    };

    // Send the request with the form data
    const data = JSON.stringify({
        weight,
        distance,
        goodsType,
        pickupLocation,
        deliveryLocation
    });
    xhr.send(data);
});
