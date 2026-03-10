const GOOGLE_FORM_ACTION = process.env.GOOGLE_FORM_ACTION;

const FIELD_IDS = {
    email: process.env.GOOGLE_FIELD_EMAIL,
    firstName: process.env.GOOGLE_FIELD_FIRST_NAME,
    lastName: process.env.GOOGLE_FIELD_LAST_NAME,
    country: process.env.GOOGLE_FIELD_COUNTRY,
    city: process.env.GOOGLE_FIELD_CITY,
    organization: process.env.GOOGLE_FIELD_ORGANIZATION,
    role: process.env.GOOGLE_FIELD_ROLE,
    interests: process.env.GOOGLE_FIELD_INTERESTS,
    otherInterestText: process.env.GOOGLE_FIELD_OTHER_INTEREST_TEXT,
    newsletter: process.env.GOOGLE_FIELD_NEWSLETTER,
};

export async function POST(request) {
    try {
        const formData = await request.json();

        const formBody = new URLSearchParams();
        formBody.append(FIELD_IDS.email, formData.email);
        formBody.append(FIELD_IDS.firstName, formData.firstName);
        formBody.append(FIELD_IDS.lastName, formData.lastName);
        formBody.append(FIELD_IDS.country, formData.country);
        formBody.append(FIELD_IDS.city, formData.city);
        formBody.append(FIELD_IDS.organization, formData.organization || "");
        formBody.append(FIELD_IDS.role, formData.role || "");
        formBody.append(FIELD_IDS.newsletter, formData.newsletter);

        formData.interests.forEach((interest) => {
            formBody.append(FIELD_IDS.interests, interest);
        });

        if (formData.hasOther && formData.otherInterest) {
            formBody.append(FIELD_IDS.interests, "__other_option__");
            formBody.append(FIELD_IDS.otherInterestText, formData.otherInterest);
        }

        const response = await fetch(GOOGLE_FORM_ACTION, {
            method: "POST",
            body: formBody,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        if (!response.ok) {
            return Response.json(
                { error: "Failed to submit form" },
                { status: 500 }
            );
        }

        return Response.json({ success: true });
    } catch (error) {
        console.error("Form submission error:", error);
        return Response.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
