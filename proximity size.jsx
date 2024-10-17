// After Effects script to scale layers based on their proximity to the first layer

// Get the active composition
var comp = app.project.activeItem;

if (comp && comp instanceof CompItem) {
    app.beginUndoGroup("Scale Layers Based on Proximity");

    // Get the first layer
    var firstLayer = comp.layer(1);

    // Add an adjustment layer to control scaling parameters
    var adjustmentLayer = comp.layers.addSolid([1, 1, 1], "Proximity Control", comp.width, comp.height, 1);
    adjustmentLayer.adjustmentLayer = true;
    var maxScaleControl = adjustmentLayer.property("Effects").addProperty("ADBE Slider Control");
    maxScaleControl.name = "Max Scale";
    maxScaleControl.property("Slider").setValue(200);
    var minScaleControl = adjustmentLayer.property("Effects").addProperty("ADBE Slider Control");
    minScaleControl.name = "Min Scale";
    minScaleControl.property("Slider").setValue(50);

    // Iterate through all layers starting from the second one
    for (var i = 2; i <= comp.numLayers; i++) {
        var currentLayer = comp.layer(i);

        // Add an expression to dynamically adjust the scale based on proximity to the first layer
        var expression = """
            refLayer = thisComp.layer(1);
            maxScale = thisComp.layer('Proximity Control').effect('Max Scale')('Slider');
            minScale = thisComp.layer('Proximity Control').effect('Min Scale')('Slider');
            maxDistance = Math.sqrt(Math.pow(thisComp.width, 2) + Math.pow(thisComp.height, 2));
            
            distance = length(refLayer.position, position);
            proximityFactor = 1 - (distance / maxDistance);
            newScale = minScale + (maxScale - minScale) * proximityFactor;
            [newScale, newScale];
        """;

        currentLayer.property("Scale").expression = expression;
    }

    app.endUndoGroup();
} else {
    alert("Please select an active composition.");
}