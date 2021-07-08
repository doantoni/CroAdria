db.beaches.updateMany({}, { $set: {
    "images": [
        {
    
            "url" : "https://res.cloudinary.com/doantoni/image/upload/v1625561866/CroAdria/apledrn2yugnxrfv0ajd.jpg",
            "filename" : "CroAdria/apledrn2yugnxrfv0ajd"
        },
        {
            "url" : "https://res.cloudinary.com/doantoni/image/upload/v1625561869/CroAdria/y1pdk3foy9qe9jxafcbs.jpg",
            "filename" : "CroAdria/y1pdk3foy9qe9jxafcbs"
        }
    ] 
} 
})

db.beaches.updateMany({}, { $set: {
    "geometry" : {
		"coordinates" : [
			16.6340985,
			43.2564305
		],
		"type" : "Point"
	}
}})