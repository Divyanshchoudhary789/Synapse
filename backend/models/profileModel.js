import mongoose from "mongoose";
const Schema = mongoose.Schema;


const EducationSchema = new Schema({
    school: {
        type: String,
        default: "",
    },

    degree: {
        type: String,
        default: "",
    },

    fieldOfStudy: {
        type: String,
        default: "",
    }

});


const WorkSchema = new Schema({
    company: {
        type: String,
        default: "",
    },
    position: {
        type: String,
        default: "",
    },
    years: {
        type: String,
        default: ""
    },
    mode: {
        type: String,
        default: "",
        enum: ["hybrid", "onsite", "remote"],
    },
    location: {
        type: String,
        default: "",
    }

});





const ProfileSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    bio: {
        type: String,
        default: "",
    },

    currentPost: {
        type: String,
        default: "",
    },

    city: {
        type: String,
        default: "",
    },

    about: {
        type: String,
        default: "",
    },

    skills: [{
        name: {
            type: String,
            required: true
        },

        experienceGainedAt: {
            type: String,
            default: ""
        }
    }],

    languages: [{
        name: {
            type: String,
            required: true,
        },
        level: {
            type: String,
            enum: ["Basic", "Intermediate", "Fluent", "Native"],
            default: "Basic",
        }
    }],

    topSkills: {
        type: [String],
        default: [],
        validate: {
            validator: function (val) {
                return val.length <= 5;
            },
            message: "You can add up to 5 skills only",
        }
    },

    experience: {
        type: [WorkSchema],
        default: [],
    },

    education: {
        type: [EducationSchema],
        default: [],
    }

});



const Profile = mongoose.model("Profile", ProfileSchema);

export default Profile;