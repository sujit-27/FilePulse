package com.myproject.FilePulse.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserCreditsDto {

    private int credits;
    private String plan;

    public int getCredits() {
        return credits;
    }

    public void setCredits(int credits) {
        this.credits = credits;
    }

    public String getPlan() {
        return plan;
    }

    public void setPlan(String plan) {
        this.plan = plan;
    }

    @Override
    public String toString() {
        return "UserCreditsDto{" +
                "credits=" + credits +
                ", plan='" + plan + '\'' +
                '}';
    }
}
