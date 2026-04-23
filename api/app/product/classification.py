REGION_KEYWORDS = {
    "australia": ["australia", "asx", "aus", "a200", "vas", "stw"],
    "usa": ["s&p 500", "nasdaq", "u.s", "usa", "america", "spdr", "ivv", "ndq"],
    "asia": ["asia", "china", "japan", "emerging", "korea", "india"],
    "europe": ["europe"],
    "global": ["world", "global", "international", "msci world"],
}


def classify_region(row):
    fund_name = str(row.fund_name).removeprefix("Global X")
    text = f"{row.category} {fund_name} {row.asx_code}".lower()

    for region, keywords in REGION_KEYWORDS.items():
        if any(k in text for k in keywords):
            return region
    return ""
